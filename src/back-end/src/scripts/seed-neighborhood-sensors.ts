import { randomUUID } from "crypto"
import { pool } from "@/config/postgres"

const SENSORS_PER_NEIGHBORHOOD = 3
const SENSOR_TABLE = process.env.SENSOR_TABLE ?? "sensors"
const SENSOR_BATTERY_COLUMN = process.env.SENSOR_BATTERY_COLUMN ?? "batery"

const SENSOR_TYPES = ["RAIN", "RIVER_LEVEL", "SOIL_MOISTURE", "WEATHER", "TEMPERATURE", "HUMIDITY"] as const
const SENSOR_STATUS = "ACTIVE"

type GeneratedSensorPoint = {
  neighborhoodId: number
  neighborhoodName: string | null
  sensorIndex: string
  latitude: string
  longitude: string
}

async function main() {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const points = await client.query<GeneratedSensorPoint>(
      `
        SELECT
          n.id AS "neighborhoodId",
          COALESCE(NULLIF(n.nm_subdist, ''), NULLIF(n.nm_dist, ''), NULLIF(n.nm_mun, '')) AS "neighborhoodName",
          ROW_NUMBER() OVER (PARTITION BY n.id ORDER BY generated.path) AS "sensorIndex",
          ST_Y(generated.geom) AS latitude,
          ST_X(generated.geom) AS longitude
        FROM neighborhoods n
        CROSS JOIN LATERAL ST_Dump(ST_GeneratePoints(n.geom, $1)) AS generated
        WHERE n.geom IS NOT NULL
        ORDER BY n.id, "sensorIndex"
      `,
      [SENSORS_PER_NEIGHBORHOOD]
    )

    const table = quoteTableName(SENSOR_TABLE)
    const columns = [
      "id",
      "name",
      "type",
      "latitude",
      "longitude",
      "status",
      SENSOR_BATTERY_COLUMN,
      "lastCommunicationAt",
      "createdAt",
      "updatedAt"
    ].map(quoteIdentifier)

    const insertSql = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `

    for (const point of points.rows) {
      console.log(point)
      const sensorIndex = Number(point.sensorIndex)
      const neighborhoodName = point.neighborhoodName ?? `Bairro ${point.neighborhoodId}`
      console.log(neighborhoodName, sensorIndex, point.latitude, point.longitude)
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
    console.log(`Sensores criados: ${points.rowCount}`)
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

function randomBatteryLevel() {
  return Math.floor(Math.random() * 41) + 60
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
