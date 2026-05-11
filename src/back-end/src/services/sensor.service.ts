import {
  CreateSensorDto,
  SENSOR_STATUSES,
  SENSOR_TYPES,
  SensorStatus,
  SensorType
} from "@/models/sensor.model"
import { SensorRepository } from "@/repositories/sensor.repository"
import { AppError, ErrorFields } from "@/types/error"
import { Sensor as PrismaSensor } from "@prisma/client"

const repository = new SensorRepository()

type SensorListQuery = {
  type?: SensorType
  status?: SensorStatus
  organizationId?: string
  page: number
  perPage: number
}

type SensorListResult = {
  items: PrismaSensor[]
  page: number
  perPage: number
  total: number
}

export class SensorService {
  static async create(data: CreateSensorDto) {
    const { parsed, fields } = this.validateCreate(data)

    if (Object.keys(fields).length > 0) {
      throw new AppError("Dados inválidos", 400, "SENSOR_VALIDATION_ERROR", fields)
    }

    return repository.create(parsed)
  }

  static async findAll(query: SensorListQuery): Promise<SensorListResult> {
    const where = {
      ...(query.organizationId ? { organizationId: query.organizationId } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.status ? { status: query.status } : {})
    }

    const skip = (query.page - 1) * query.perPage
    const take = query.perPage

    const [items, total] = await Promise.all([
      repository.findMany({ where, skip, take }),
      repository.count(where)
    ])

    return {
      items,
      page: query.page,
      perPage: query.perPage,
      total
    }
  }

  static async findById(id: string) {
    const sensor = await repository.findById(id)

    if (!sensor) {
      throw new AppError("Sensor não encontrado", 404, "SENSOR_NOT_FOUND")
    }

    return sensor
  }

  static async update(id: string, data: Partial<CreateSensorDto>) {
    const sensor = await repository.findById(id)

    if (!sensor) {
      throw new AppError("Sensor não encontrado", 404, "SENSOR_NOT_FOUND")
    }

    const { parsed, fields } = this.validateUpdate(data)

    if (Object.keys(fields).length > 0) {
      throw new AppError("Dados inválidos", 400, "SENSOR_VALIDATION_ERROR", fields)
    }

    return repository.update(id, parsed)
  }

  static async delete(id: string) {
    const sensor = await repository.findById(id)

    if (!sensor) {
      throw new AppError("Sensor não encontrado", 404, "SENSOR_NOT_FOUND")
    }

    return repository.delete(id)
  }

  private static validateCreate(data: CreateSensorDto): {
    parsed: Omit<CreateSensorDto, "lastCommunicationAt"> & { lastCommunicationAt?: Date | null }
    fields: ErrorFields
  } {
    const fields: ErrorFields = {}

    if (!data.organizationId) fields.organizationId = "organizationId é obrigatório"
    if (!data.name) fields.name = "name é obrigatório"
    if (!data.type) fields.type = "type é obrigatório"
    if (!data.status) fields.status = "status é obrigatório"

    const type = this.parseType(data.type, fields)
    const status = this.parseStatus(data.status, fields)

    const latitude = this.parseLatitude(data.latitude, fields)
    const longitude = this.parseLongitude(data.longitude, fields)
    const batteryLevel = this.parseBatteryLevel(data.batteryLevel, fields)
    const lastCommunicationAt = this.parseDate(data.lastCommunicationAt, "lastCommunicationAt", fields)

    return {
      parsed: {
        name: data.name,
        description: data.description ?? null,
        type,
        organizationId: data.organizationId,
        latitude,
        longitude,
        status,
        ...(batteryLevel !== undefined && { batteryLevel }),
        ...(lastCommunicationAt !== undefined && { lastCommunicationAt })
      },
      fields
    }
  }

  private static validateUpdate(data: Partial<CreateSensorDto>): {
    parsed: Partial<Omit<CreateSensorDto, "lastCommunicationAt"> & { lastCommunicationAt?: Date | null }>
    fields: ErrorFields
  } {
    const fields: ErrorFields = {}

    const type = data.type !== undefined ? this.parseType(data.type, fields) : undefined
    const status = data.status !== undefined ? this.parseStatus(data.status, fields) : undefined
    const latitude = data.latitude !== undefined ? this.parseLatitude(data.latitude, fields) : undefined
    const longitude =
      data.longitude !== undefined ? this.parseLongitude(data.longitude, fields) : undefined
    const batteryLevel =
      data.batteryLevel !== undefined ? this.parseBatteryLevel(data.batteryLevel, fields) : undefined
    const lastCommunicationAt =
      data.lastCommunicationAt !== undefined
        ? this.parseDate(data.lastCommunicationAt, "lastCommunicationAt", fields)
        : undefined

    return {
      parsed: {
        ...(data.organizationId !== undefined && { organizationId: data.organizationId }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(type !== undefined && { type }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(status !== undefined && { status }),
        ...(batteryLevel !== undefined && { batteryLevel }),
        ...(lastCommunicationAt !== undefined && { lastCommunicationAt })
      },
      fields
    }
  }

  private static parseType(type: SensorType, fields: ErrorFields): SensorType {
    if (!SENSOR_TYPES.includes(type)) {
      fields.type = "type inválido"
      return type
    }
    return type
  }

  private static parseStatus(status: SensorStatus, fields: ErrorFields): SensorStatus {
    if (!SENSOR_STATUSES.includes(status)) {
      fields.status = "status inválido"
      return status
    }
    return status
  }

  private static parseLatitude(latitude: number, fields: ErrorFields): number {
    if (typeof latitude !== "number" || Number.isNaN(latitude)) {
      fields.latitude = "latitude é obrigatória"
      return latitude
    }
    if (latitude < -90 || latitude > 90) fields.latitude = "latitude deve estar entre -90 e 90"
    return latitude
  }

  private static parseLongitude(longitude: number, fields: ErrorFields): number {
    if (typeof longitude !== "number" || Number.isNaN(longitude)) {
      fields.longitude = "longitude é obrigatória"
      return longitude
    }
    if (longitude < -180 || longitude > 180) {
      fields.longitude = "longitude deve estar entre -180 e 180"
    }
    return longitude
  }

  private static parseBatteryLevel(batteryLevel: number | null | undefined, fields: ErrorFields) {
    if (batteryLevel === undefined) return undefined
    if (batteryLevel === null) return null

    if (typeof batteryLevel !== "number" || Number.isNaN(batteryLevel)) {
      fields.batteryLevel = "batteryLevel deve ser um número"
      return batteryLevel
    }

    if (batteryLevel < 0 || batteryLevel > 100) {
      fields.batteryLevel = "batteryLevel deve estar entre 0 e 100"
    }

    return Math.trunc(batteryLevel)
  }

  private static parseDate(
    value: Date | string | null | undefined,
    field: keyof ErrorFields,
    fields: ErrorFields
  ) {
    if (value === undefined) return undefined
    if (value === null) return null

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) fields[field] = `${String(field)} inválido`
      return value
    }

    if (typeof value !== "string") {
      fields[field] = `${String(field)} inválido`
      return value as never
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) fields[field] = `${String(field)} inválido`
    return parsed
  }
}
