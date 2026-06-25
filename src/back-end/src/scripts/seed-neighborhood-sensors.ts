import { randomUUID } from "crypto"
import { pool } from "@/config/postgres"
import { CoordinatesAddress, GeolocationService } from "@/services/geolocation.service"

const SENSOR_TABLE = process.env.SENSOR_TABLE ?? "sensors"
const SENSOR_BATTERY_COLUMN = process.env.SENSOR_BATTERY_COLUMN ?? "batery"

const SENSOR_STATUS = "ACTIVE"
const SENSOR_COUNTRY = "Brasil"
const NOMINATIM_LOOP_DELAY_MS = 10_000

type NeighborhoodCoordinates = {
  latitude: number
  longitude: number
}

async function main() {
  const client = await pool.connect()

  try {
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
      await sleep(NOMINATIM_LOOP_DELAY_MS)

      const address = await GeolocationService.getAddressFromCoordinates(
        coordinate.latitude,
        coordinate.longitude
      )

      const now = new Date()

      await client.query(insertSql, [
        randomUUID(),
        buildSensorName(sensorIndex, address),
        coordinate.latitude,
        coordinate.longitude,
        SENSOR_STATUS,
        randomBatteryLevel(),
        address?.street ?? null,
        address?.neighborhood ?? null,
        address?.city ?? null,
        address?.state ?? null,
        SENSOR_COUNTRY,
        now,
        now,
        now
      ])
    }

  } catch (error) {
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

function randomBatteryLevel() {
  return Math.floor(Math.random() * 41) + 60
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildSensorName(index: number, address: CoordinatesAddress | null) {
  const location = [address?.street, address?.neighborhood].filter(Boolean).join(" - ")

  return location ? `Sensor ${index} - ${location}` : `Sensor ${index}`
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
