import { randomUUID } from "crypto"
import { pool } from "@/config/postgres"
import { GeolocationService } from "@/services/geolocation.service"

const SENSORS_PER_NEIGHBORHOOD = 5
const SENSOR_TABLE = process.env.SENSOR_TABLE ?? "sensors"
const SENSOR_BATTERY_COLUMN = process.env.SENSOR_BATTERY_COLUMN ?? "batery"
const NOMINATIM_REQUEST_INTERVAL_MS = Number(
  process.env.NOMINATIM_REQUEST_INTERVAL_MS ?? 1000
)
const NOMINATIM_MAX_ATTEMPTS = Number(
  process.env.NOMINATIM_MAX_ATTEMPTS ?? 3
)

const SENSOR_TYPES = [
  "RAIN",
  "RIVER_LEVEL",
  "SOIL_MOISTURE",
  "WEATHER",
  "TEMPERATURE",
  "HUMIDITY"
] as const

const SENSOR_STATUS = "ACTIVE"

type GeneratedSensorPoint = {
  neighborhoodId: number
  neighborhoodName: string | null
  sensorIndex: string
  latitude: string
  longitude: string
}

async function main() {
  try {
    const points = await generateSensorPoints()
    const groups = groupByNeighborhoodPolygon(points)
    let processed = 0
    let createdNeighborhoods = 0
    let skippedNeighborhoods = 0
    let createdSensors = 0

    console.log(
      `Poligonos encontrados: ${groups.size}. Sensores por bairro: ${SENSORS_PER_NEIGHBORHOOD}.`
    )

    for (const [neighborhoodId, neighborhoodPoints] of groups) {
      processed += 1

      const neighborhoodName = await resolveNeighborhoodName(
        neighborhoodPoints[0]
      )

      if (await neighborhoodAlreadyHasSensors(neighborhoodName)) {
        skippedNeighborhoods += 1
        console.log(
          `[${processed}/${groups.size}] Ignorado: ${neighborhoodName} (poligono ${neighborhoodId}) ja possui sensores.`
        )
        continue
      }

      const inserted = await insertNeighborhoodSensors(
        neighborhoodPoints,
        neighborhoodName
      )

      if (!inserted) {
        skippedNeighborhoods += 1
        console.log(
          `[${processed}/${groups.size}] Ignorado: ${neighborhoodName} (poligono ${neighborhoodId}) ja possui sensores.`
        )
        continue
      }

      createdNeighborhoods += 1
      createdSensors += neighborhoodPoints.length

      console.log(
        `[${processed}/${groups.size}] Criado: ${neighborhoodName} (poligono ${neighborhoodId}) - ${neighborhoodPoints.length} sensores.`
      )
    }

    console.log("Seed concluido.")
    console.log(`Bairros criados: ${createdNeighborhoods}`)
    console.log(`Bairros ignorados: ${skippedNeighborhoods}`)
    console.log(`Sensores criados: ${createdSensors}`)
  } finally {
    await pool.end()
  }
}

async function generateSensorPoints(): Promise<GeneratedSensorPoint[]> {
  const result = await pool.query<GeneratedSensorPoint>(
    `
      SELECT
        n.id AS "neighborhoodId",
        COALESCE(
          NULLIF(n.nm_subdist, ''),
          NULLIF(n.nm_dist, ''),
          NULLIF(n.nm_mun, '')
        ) AS "neighborhoodName",
        ROW_NUMBER() OVER (
          PARTITION BY n.id
          ORDER BY generated.path
        )::text AS "sensorIndex",
        ST_Y(generated.geom)::text AS latitude,
        ST_X(generated.geom)::text AS longitude
      FROM neighborhoods n
      CROSS JOIN LATERAL ST_Dump(
        ST_GeneratePoints(n.geom, $1)
      ) AS generated
      WHERE n.geom IS NOT NULL
      ORDER BY n.id, "sensorIndex"
    `,
    [SENSORS_PER_NEIGHBORHOOD]
  )

  return result.rows
}

function groupByNeighborhoodPolygon(points: GeneratedSensorPoint[]) {
  const groups = new Map<number, GeneratedSensorPoint[]>()

  for (const point of points) {
    const group = groups.get(point.neighborhoodId) ?? []
    group.push(point)
    groups.set(point.neighborhoodId, group)
  }

  return groups
}

async function resolveNeighborhoodName(
  point: GeneratedSensorPoint
): Promise<string> {
  const fallbackName =
    point.neighborhoodName?.trim() || `Bairro ${point.neighborhoodId}`

  for (let attempt = 1; attempt <= NOMINATIM_MAX_ATTEMPTS; attempt += 1) {
    try {
      const address = await GeolocationService.getAddressFromCoordinates(
        Number(point.latitude),
        Number(point.longitude)
      )

      await wait(NOMINATIM_REQUEST_INTERVAL_MS)

      return address?.neighborhood?.trim() || fallbackName
    } catch (error) {
      const isLastAttempt = attempt === NOMINATIM_MAX_ATTEMPTS

      if (isLastAttempt) {
        console.warn(
          `Geolocalizacao indisponivel para o poligono ${point.neighborhoodId}; usando "${fallbackName}".`,
          formatError(error)
        )
        return fallbackName
      }

      const retryDelay = getRetryDelay(error, attempt)
      console.warn(
        `Falha na geolocalizacao do poligono ${point.neighborhoodId}. Tentativa ${attempt}/${NOMINATIM_MAX_ATTEMPTS}; novo envio em ${retryDelay} ms.`,
        formatError(error)
      )
      await wait(retryDelay)
    }
  }

  return fallbackName
}

async function neighborhoodAlreadyHasSensors(neighborhoodName: string) {
  const table = quoteTableName(SENSOR_TABLE)

  const result = await pool.query<{ exists: boolean }>(
    `
      SELECT EXISTS (
        SELECT 1
        FROM ${table}
        WHERE
          LOWER(LEFT(name, LENGTH($1))) = LOWER($1)
          AND SUBSTRING(name FROM LENGTH($1) + 1) LIKE ' - Sensor %'
      ) AS "exists"
    `,
    [neighborhoodName]
  )

  return result.rows[0]?.exists ?? false
}

async function insertNeighborhoodSensors(
  points: GeneratedSensorPoint[],
  neighborhoodName: string
) {
  const client = await pool.connect()
  const table = quoteTableName(SENSOR_TABLE)
  const batteryColumn = quoteIdentifier(SENSOR_BATTERY_COLUMN)

  try {
    await client.query("BEGIN")

    const alreadyExists = await client.query<{ exists: boolean }>(
      `
        SELECT EXISTS (
          SELECT 1
          FROM ${table}
          WHERE
            LOWER(LEFT(name, LENGTH($1))) = LOWER($1)
            AND SUBSTRING(name FROM LENGTH($1) + 1) LIKE ' - Sensor %'
        ) AS "exists"
      `,
      [neighborhoodName]
    )

    if (alreadyExists.rows[0]?.exists) {
      await client.query("ROLLBACK")
      return false
    }

    const insertSql = `
      INSERT INTO ${table} (
        id,
        name,
        type,
        latitude,
        longitude,
        status,
        ${batteryColumn},
        "lastCommunicationAt",
        "createdAt",
        "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `

    for (const point of points) {
      const sensorIndex = Number(point.sensorIndex)
      const now = new Date()

      await client.query(insertSql, [
        randomUUID(),
        `${neighborhoodName} - Sensor ${sensorIndex}`,
        SENSOR_TYPES[(sensorIndex - 1) % SENSOR_TYPES.length],
        Number(point.latitude),
        Number(point.longitude),
        SENSOR_STATUS,
        randomBatteryLevel(),
        now,
        now,
        now
      ])
    }

    await client.query("COMMIT")
    return true
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

function getRetryDelay(error: unknown, attempt: number) {
  const status =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
      ? error.status
      : undefined

  if (status === 429) {
    return NOMINATIM_REQUEST_INTERVAL_MS * 5 * attempt
  }

  return NOMINATIM_REQUEST_INTERVAL_MS * attempt
}

function formatError(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

function randomBatteryLevel() {
  return Math.floor(Math.random() * 41) + 60
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function quoteTableName(tableName: string) {
  return tableName.split(".").map(quoteIdentifier).join(".")
}

function quoteIdentifier(identifier: string) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(identifier)) {
    throw new Error(`Identificador SQL invalido: ${identifier}`)
  }

  return `"${identifier}"`
}

main().catch((error) => {
  console.error("Erro ao criar sensores dos bairros", error)
  process.exit(1)
})
