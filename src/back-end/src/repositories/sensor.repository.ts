import { pool } from "@/config/postgres"
import {
  CreateSensorDto,
  Sensor,
  SensorStatus,
  SensorType,
  UpdateSensorDto
} from "@/models/sensor.model"
import { randomUUID } from "crypto"

type SensorWhereInput = {
  type?: SensorType
  status?: SensorStatus
}

const SENSOR_COLUMNS = `
  id,
  name,
  type,
  latitude,
  longitude,
  status,
  batery,
  "lastCommunicationAt",
  "createdAt",
  "updatedAt"
`

export class SensorRepository {
  async create(
    data: Omit<CreateSensorDto, "lastCommunicationAt"> & { lastCommunicationAt?: Date | null }
  ): Promise<Sensor> {
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
          "lastCommunicationAt",
          "createdAt",
          "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING ${SENSOR_COLUMNS}
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
    const result = await pool.query<Sensor>(
      `
        SELECT ${SENSOR_COLUMNS}
        FROM sensors
        WHERE id = $1
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
        RETURNING ${SENSOR_COLUMNS}
      `,
      values
    )

    return result.rows[0] ?? null
  }

  async delete(id: string): Promise<Sensor | null> {
    const result = await pool.query<Sensor>(
      `
        DELETE FROM sensors
        WHERE id = $1
        RETURNING ${SENSOR_COLUMNS}
      `,
      [id]
    )

    return result.rows[0] ?? null
  }

  async findMany(params: { where: SensorWhereInput; skip: number; take: number }): Promise<Sensor[]> {
    const { whereSql, values } = this.buildWhere(params.where)
    values.push(params.take, params.skip)

    const result = await pool.query<Sensor>(
      `
        SELECT ${SENSOR_COLUMNS}
        FROM sensors
        ${whereSql}
        ORDER BY "createdAt" DESC
        LIMIT $${values.length - 1}
        OFFSET $${values.length}
      `,
      values
    )

    return result.rows
  }

  async count(where: SensorWhereInput): Promise<number> {
    const { whereSql, values } = this.buildWhere(where)
    const result = await pool.query<{ total: string }>(
      `
        SELECT COUNT(*) AS total
        FROM sensors
        ${whereSql}
      `,
      values
    )

    return Number(result.rows[0]?.total ?? 0)
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
      clauses.push(`type = $${values.length}`)
    }

    if (where.status) {
      values.push(where.status)
      clauses.push(`status = $${values.length}`)
    }

    return {
      whereSql: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
      values
    }
  }
}
