import { randomUUID } from "crypto"
import { pool } from "@/config/postgres"

const SENSOR_TABLE = process.env.SENSOR_TABLE ?? "sensors"
const SENSOR_BATTERY_COLUMN = process.env.SENSOR_BATTERY_COLUMN ?? "batery"

const SENSOR_STATUS = "ACTIVE"

type NeighborhoodCoordinates = {
  latitude: number
  longitude: number
}

async function main() {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const coordinates = await client.query<NeighborhoodCoordinates>(
      `
        SELECT
          ST_Y(ST_PointOnSurface(n.geom)) AS latitude,
          ST_X(ST_PointOnSurface(n.geom)) AS longitude
        FROM neighborhoods n
        WHERE n.geom IS NOT NULL
        ORDER BY n.id
      `
    )

    const table = quoteTableName(SENSOR_TABLE)
    const columns = [
      "id",
      "name",
      "latitude",
      "longitude",
      "status",
      SENSOR_BATTERY_COLUMN,
      "rua",
      "bairro",
      "cidade",
      "estado",
      "pais",
      "lastCommunicationAt",
      "createdAt",
      "updatedAt"
    ].map(quoteIdentifier)

    const insertSql = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `

    for (const [index, coordinate] of coordinates.rows.entries()) {
      const sensorIndex = index + 1
      const now = new Date()

      await client.query(insertSql, [
        randomUUID(),
        buildSensorName(sensorIndex),
        coordinate.latitude,
        coordinate.longitude,
        SENSOR_STATUS,
        randomBatteryLevel(),
        null,
        null,
        null,
        null,
        null,
        now,
        now,
        now
      ])
    }

    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

function randomBatteryLevel() {
  return Math.floor(Math.random() * 41) + 60
}

function buildSensorName(index: number) {
  return `Sensor ${index}`
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
