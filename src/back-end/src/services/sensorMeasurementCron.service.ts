import { SensorMeasurement, SensorType } from "@/models/sensor.model"
import { SensorRepository } from "@/repositories/sensor.repository"

type MeasurementRule = {
  min: number
  max: number
  decimals: number
  unit: string
}

const DEFAULT_INTERVAL_MS = 60_000

const MEASUREMENT_RULES: Record<SensorType, MeasurementRule> = {
  RAIN: { min: 0, max: 45, decimals: 1, unit: "mm" },
  RIVER_LEVEL: { min: 0.2, max: 6.5, decimals: 2, unit: "m" },
  SOIL_MOISTURE: { min: 12, max: 96, decimals: 1, unit: "%" },
  WEATHER: { min: 960, max: 1040, decimals: 1, unit: "hPa" },
  TEMPERATURE: { min: 12, max: 39, decimals: 1, unit: "C" },
  HUMIDITY: { min: 30, max: 100, decimals: 1, unit: "%" }
}

const repository = new SensorRepository()
let timer: NodeJS.Timeout | null = null
let isRunning = false

export class SensorMeasurementCronService {
  static async insertMeasurements() {
    const sensors = await repository.findAllForMeasurementGeneration()
    const measuredAt = new Date().toISOString()

    const measurements = sensors.map((sensor) => ({
      sensorId: sensor.id,
      measurement: this.generateMeasurement(sensor.type, measuredAt)
    }))

    return repository.appendMeasurements(measurements)
  }

  private static generateMeasurement(type: SensorType, measuredAt: string): SensorMeasurement {
    const rule = MEASUREMENT_RULES[type]

    return {
      measuredAt,
      value: randomNumber(rule.min, rule.max, rule.decimals),
      unit: rule.unit
    }
  }
}

export function startSensorMeasurementsCron() {
  if (timer || process.env.SENSOR_MEASUREMENTS_CRON_ENABLED === "false") return

  timer = setInterval(() => {
    if (isRunning) return

    isRunning = true

    SensorMeasurementCronService.insertMeasurements()
      .catch((error) => {
        console.error("Erro ao gerar histórico de medições dos sensores", error)
      })
      .finally(() => {
        isRunning = false
      })
  }, parseIntervalMs())
}

function parseIntervalMs() {
  const interval = Number(process.env.SENSOR_MEASUREMENTS_CRON_MS)

  if (!Number.isFinite(interval) || interval < 1_000) {
    return DEFAULT_INTERVAL_MS
  }

  return interval
}

function randomNumber(min: number, max: number, decimals: number) {
  const factor = 10 ** decimals
  return Math.round((Math.random() * (max - min) + min) * factor) / factor
}
