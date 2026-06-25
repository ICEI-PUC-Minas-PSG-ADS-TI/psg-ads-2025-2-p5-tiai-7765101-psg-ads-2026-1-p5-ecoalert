import { pool } from "@/config/postgres"
import {
  CreateSensorDto,
  Sensor,
  SensorMeasurement,
  SensorStatus,
  SensorType,
  UpdateSensorDto
} from "@/models/sensor.model"
import { randomUUID } from "crypto"

type SensorWhereInput = {
  type?: SensorType
  status?: SensorStatus
  neighborhood?: string
}

type SensorOrigin = {
  latitude: number
  longitude: number
}

const SENSOR_RETURN_COLUMNS = `
  id,
  name,
  type,
  latitude,
  longitude,
  status,
  batery,
  rua,
  bairro,
  cidade,
  estado,
  pais,
  COALESCE("measurementsHistory", '[]'::jsonb) AS "measurementsHistory",
  "lastCommunicationAt",
  "createdAt",
  "updatedAt"
`

const SENSOR_NEIGHBORHOOD_JOIN = `
  LEFT JOIN LATERAL (
    SELECT
      COALESCE(NULLIF(n.nm_subdist, ''), NULLIF(n.nm_dist, ''), NULLIF(n.nm_mun, '')) AS name,
      NULLIF(n.nm_mun, '') AS city,
      NULLIF(n.sigla_uf, '') AS state
    FROM neighborhoods n
    WHERE n.geom IS NOT NULL
      AND ST_Covers(n.geom, ST_SetSRID(ST_MakePoint(s.longitude, s.latitude), 4674))
    ORDER BY n.id
    LIMIT 1
  ) neighborhood ON true
`

let sensorColumnsReady: Promise<void> | null = null

export class SensorRepository {
  async create(
    data: Omit<CreateSensorDto, "lastCommunicationAt"> & { lastCommunicationAt?: Date | null }
  ): Promise<Sensor> {
    await this.ensureSensorColumns()

    const result = await pool.query<Sensor>(
      `
        INSERT INTO sensors (
          id,
          name,
          type,
          latitude,
          longitude,
          status,
          batery,
          rua,
          bairro,
          cidade,
          estado,
          pais,
          "lastCommunicationAt",
          "createdAt",
          "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, NULL, NULL, NULL, NULL, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING ${SENSOR_RETURN_COLUMNS}
      `,
      [
        data.id ?? randomUUID(),
        data.name,
        data.type,
        data.latitude,
        data.longitude,
        data.status,
        data.batery ?? null,
        data.lastCommunicationAt ?? null
      ]
    )

    return result.rows[0]
  }

  async findById(id: string): Promise<Sensor | null> {
    await this.ensureSensorColumns()

    const result = await pool.query<Sensor>(
      `
        SELECT ${this.buildSelectColumns("NULL::double precision")}
        FROM sensors s
        ${SENSOR_NEIGHBORHOOD_JOIN}
        WHERE s.id = $1
        LIMIT 1
      `,
      [id]
    )

    return result.rows[0] ?? null
  }

  async update(
    id: string,
    data: Partial<Omit<UpdateSensorDto, "lastCommunicationAt"> & { lastCommunicationAt?: Date | null }>
  ): Promise<Sensor | null> {
    await this.ensureSensorColumns()

    const values: unknown[] = []
    const assignments: string[] = []

    this.addAssignment(assignments, values, "name", data.name)
    this.addAssignment(assignments, values, "type", data.type)
    this.addAssignment(assignments, values, "latitude", data.latitude)
    this.addAssignment(assignments, values, "longitude", data.longitude)
    this.addAssignment(assignments, values, "status", data.status)
    this.addAssignment(assignments, values, "batery", data.batery)
    this.addAssignment(assignments, values, '"lastCommunicationAt"', data.lastCommunicationAt)

    if (assignments.length === 0) {
      return this.findById(id)
    }

    values.push(id)

    const result = await pool.query<Sensor>(
      `
        UPDATE sensors
        SET ${assignments.join(", ")}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = $${values.length}
        RETURNING ${SENSOR_RETURN_COLUMNS}
      `,
      values
    )

    return result.rows[0] ?? null
  }

  async delete(id: string): Promise<Sensor | null> {
    await this.ensureSensorColumns()

    const result = await pool.query<Sensor>(
      `
        DELETE FROM sensors
        WHERE id = $1
        RETURNING ${SENSOR_RETURN_COLUMNS}
      `,
      [id]
    )

    return result.rows[0] ?? null
  }

  async findMany(params: {
    where: SensorWhereInput
    skip: number
    take: number
    origin?: SensorOrigin
  }): Promise<Sensor[]> {
    await this.ensureSensorColumns()

    const { whereSql, values } = this.buildWhere(params.where)
    const distanceSql = this.buildDistanceSql(params.origin, values)
    values.push(params.take, params.skip)

    const result = await pool.query<Sensor>(
      `
        SELECT ${this.buildSelectColumns(distanceSql)}
        FROM sensors s
        ${SENSOR_NEIGHBORHOOD_JOIN}
        ${whereSql}
        ORDER BY ${params.origin ? '"distanceKm" ASC NULLS LAST,' : ""} s."createdAt" DESC
        LIMIT $${values.length - 1}
        OFFSET $${values.length}
      `,
      values
    )

    return result.rows
  }

  async count(where: SensorWhereInput): Promise<number> {
    await this.ensureSensorColumns()

    const { whereSql, values } = this.buildWhere(where)
    const result = await pool.query<{ total: string }>(
      `
        SELECT COUNT(*) AS total
        FROM sensors s
        ${whereSql}
      `,
      values
    )

    return Number(result.rows[0]?.total ?? 0)
  }

  async findAllForMeasurementGeneration(): Promise<Array<Pick<Sensor, "id" | "type">>> {
    const result = await pool.query<Array<Pick<Sensor, "id" | "type">>[number]>(
      `
        SELECT id, type
        FROM sensors
        ORDER BY id
      `
    )

    return result.rows
  }

  async appendMeasurements(
    measurements: Array<{ sensorId: string; measurement: SensorMeasurement }>
  ): Promise<number> {
    if (measurements.length === 0) return 0
    await this.ensureSensorColumns()

    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      for (const { sensorId, measurement } of measurements) {
        await client.query(
          `
            UPDATE sensors
            SET
              "measurementsHistory" = COALESCE("measurementsHistory", '[]'::jsonb) || $2::jsonb,
              "lastCommunicationAt" = CURRENT_TIMESTAMP,
              "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $1
          `,
          [sensorId, JSON.stringify([measurement])]
        )
      }

      await client.query("COMMIT")
      return measurements.length
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  }

  private addAssignment(assignments: string[], values: unknown[], column: string, value: unknown) {
    if (value === undefined) return

    values.push(value)
    assignments.push(`${column} = $${values.length}`)
  }

  private buildWhere(where: SensorWhereInput) {
    const values: unknown[] = []
    const clauses: string[] = []

    if (where.type) {
      values.push(where.type)
      clauses.push(`s.type = $${values.length}`)
    }

    if (where.status) {
      values.push(where.status)
      clauses.push(`s.status = $${values.length}`)
    }

    if (where.neighborhood) {
      values.push(`%${where.neighborhood}%`)
      clauses.push(`
        (
          s.name ILIKE $${values.length}
          OR EXISTS (
            SELECT 1
            FROM neighborhoods n
            WHERE n.geom IS NOT NULL
              AND ST_Covers(n.geom, ST_SetSRID(ST_MakePoint(s.longitude, s.latitude), 4674))
              AND (
                s.bairro ILIKE $${values.length}
                OR s.cidade ILIKE $${values.length}
                OR n.nm_subdist ILIKE $${values.length}
                OR n.nm_dist ILIKE $${values.length}
                OR n.nm_mun ILIKE $${values.length}
              )
          )
        )
      `)
    }

    return {
      whereSql: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
      values
    }
  }

  private buildSelectColumns(distanceSql: string) {
    return `
      s.id,
      s.name,
      s.type,
      s.latitude,
      s.longitude,
      s.status,
      s.batery,
      s.rua,
      s.bairro,
      s.cidade,
      s.estado,
      s.pais,
      COALESCE(s."measurementsHistory", '[]'::jsonb) AS "measurementsHistory",
      s."lastCommunicationAt",
      s."createdAt",
      s."updatedAt",
      COALESCE(NULLIF(s.bairro, ''), neighborhood.name) AS neighborhood,
      NULLIF(
        CONCAT_WS(
          ', ',
          NULLIF(s.rua, ''),
          COALESCE(NULLIF(s.bairro, ''), neighborhood.name),
          NULLIF(s.cidade, ''),
          NULLIF(s.estado, ''),
          NULLIF(s.pais, '')
        ),
        ''
      ) AS address,
      ${distanceSql} AS "distanceKm"
    `
  }

  private buildDistanceSql(origin: SensorOrigin | undefined, values: unknown[]) {
    if (!origin) return "NULL::double precision"

    values.push(origin.latitude)
    const latitudeIndex = values.length

    values.push(origin.longitude)
    const longitudeIndex = values.length

    return `
      (
        6371 * 2 * ASIN(
          LEAST(1, SQRT(
            POWER(SIN(RADIANS((s.latitude - $${latitudeIndex}) / 2)), 2)
            + COS(RADIANS($${latitudeIndex}))
            * COS(RADIANS(s.latitude))
            * POWER(SIN(RADIANS((s.longitude - $${longitudeIndex}) / 2)), 2)
          ))
        )
      )
    `
  }

  private ensureSensorColumns() {
    if (!sensorColumnsReady) {
      sensorColumnsReady = pool
        .query(`
          ALTER TABLE sensors
          ADD COLUMN IF NOT EXISTS "measurementsHistory" JSONB NOT NULL DEFAULT '[]'::jsonb,
          ADD COLUMN IF NOT EXISTS rua TEXT,
          ADD COLUMN IF NOT EXISTS bairro TEXT,
          ADD COLUMN IF NOT EXISTS cidade TEXT,
          ADD COLUMN IF NOT EXISTS estado TEXT,
          ADD COLUMN IF NOT EXISTS pais TEXT
        `)
        .then(() => undefined)
        .catch((error) => {
          sensorColumnsReady = null
          throw error
        })
    }

    return sensorColumnsReady
  }
}

