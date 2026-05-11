import {
  SENSOR_STATUSES,
  SENSOR_TYPES,
  SensorStatus,
  SensorType
} from "@/models/sensor.model"
import { SensorService } from "@/services/sensor.service"
import { Request, Response } from "express"

type Params = {
  id: string
}

export async function createSensor(req: Request, res: Response) {
  const created = await SensorService.create(req.body)
  return res.status(201).json(created)
}

export async function getSensors(req: Request, res: Response) {
  const page = parsePositiveInt(req.query.page, 1, 1_000_000)
  const perPage = parsePositiveInt(req.query.perPage, 10, 100)

  const type = parseOptionalString(req.query.type)
  const status = parseOptionalString(req.query.status)
  const organizationId = parseOptionalString(req.query.organizationId)

  const result = await SensorService.findAll({
    ...(type ? { type: parseSensorType(type) } : {}),
    ...(status ? { status: parseSensorStatus(status) } : {}),
    ...(organizationId ? { organizationId } : {}),
    page,
    perPage
  })

  return res.json(result)
}

export async function getSensorById(req: Request<Params>, res: Response) {
  const { id } = req.params
  return res.json(await SensorService.findById(id))
}

export async function updateSensor(req: Request<Params>, res: Response) {
  const { id } = req.params
  return res.json(await SensorService.update(id, req.body))
}

export async function deleteSensor(req: Request<Params>, res: Response) {
  const { id } = req.params
  await SensorService.delete(id)
  return res.json({ message: "Sensor deletado com sucesso" })
}

function parseOptionalString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value
  return undefined
}

function parsePositiveInt(value: unknown, fallback: number, max: number) {
  if (typeof value !== "string") return fallback
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed < 1) return fallback
  if (parsed > max) return max
  return parsed
}

function parseSensorType(value: string): SensorType {
  if (SENSOR_TYPES.includes(value as SensorType)) return value as SensorType
  return value as SensorType
}

function parseSensorStatus(value: string): SensorStatus {
  if (SENSOR_STATUSES.includes(value as SensorStatus)) return value as SensorStatus
  return value as SensorStatus
}
