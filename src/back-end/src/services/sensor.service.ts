import {
  CreateSensorDto,
  SENSOR_STATUSES,
  SENSOR_TYPES,
  Sensor,
  SensorStatus,
  SensorType,
  UpdateSensorDto
} from "@/models/sensor.model"
import { SensorRepository } from "@/repositories/sensor.repository"
import { AppError, ErrorFields } from "@/types/error"

const repository = new SensorRepository()

type SensorListQuery = {
  type?: SensorType
  status?: SensorStatus
  neighborhood?: string
  latitude?: number
  longitude?: number
  page: number
  perPage: number
}

type SensorListResult = {
  items: Sensor[]
  page: number
  perPage: number
  total: number
  totalPages: number
  summary: {
    online: number
    offline: number
    lowBattery: number
  }
}

export class SensorService {
  static async create(data: CreateSensorDto) {
    const { parsed, fields } = this.validateCreate(data)

    if (Object.keys(fields).length > 0) {
      throw new AppError("Dados invalidos", 400, "SENSOR_VALIDATION_ERROR", fields)
    }

    return repository.create(parsed)
  }

  static async findAll(query: SensorListQuery): Promise<SensorListResult> {
    const fields: ErrorFields = {}

    if (query.type) this.parseType(query.type, fields)
    if (query.status) this.parseStatus(query.status, fields)
    const origin = this.parseOrigin(query.latitude, query.longitude, fields)

    if (Object.keys(fields).length > 0) {
      throw new AppError("Dados invalidos", 400, "SENSOR_VALIDATION_ERROR", fields)
    }

    const neighborhood = query.neighborhood?.trim()
    const where = {
      ...(query.type ? { type: query.type } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(neighborhood ? { neighborhood } : {})
    }

    const skip = (query.page - 1) * query.perPage
    const take = query.perPage

    const [items, total, summary] = await Promise.all([
      repository.findMany({ where, skip, take, origin }),
      repository.count(where),
      repository.countSummary(where)
    ])

    return {
      items,
      page: query.page,
      perPage: query.perPage,
      total,
      totalPages: Math.ceil(total / query.perPage),
      summary
    }
  }

  static async findById(id: string) {
    const sensor = await repository.findById(id)

    if (!sensor) {
      throw new AppError("Sensor nao encontrado", 404, "SENSOR_NOT_FOUND")
    }

    return sensor
  }

  static async update(id: string, data: UpdateSensorDto) {
    const sensor = await repository.findById(id)

    if (!sensor) {
      throw new AppError("Sensor nao encontrado", 404, "SENSOR_NOT_FOUND")
    }

    const { parsed, fields } = this.validateUpdate(data)

    if (Object.keys(fields).length > 0) {
      throw new AppError("Dados invalidos", 400, "SENSOR_VALIDATION_ERROR", fields)
    }

    return repository.update(id, parsed)
  }

  static async delete(id: string) {
    const sensor = await repository.findById(id)

    if (!sensor) {
      throw new AppError("Sensor nao encontrado", 404, "SENSOR_NOT_FOUND")
    }

    return repository.delete(id)
  }

  private static validateCreate(data: CreateSensorDto): {
    parsed: Omit<CreateSensorDto, "lastCommunicationAt"> & { lastCommunicationAt?: Date | null }
    fields: ErrorFields
  } {
    const fields: ErrorFields = {}

    if (!data.name) fields.name = "name e obrigatorio"
    if (!data.type) fields.type = "type e obrigatorio"
    if (!data.status) fields.status = "status e obrigatorio"

    const type = this.parseType(data.type, fields)
    const status = this.parseStatus(data.status, fields)
    const latitude = this.parseLatitude(data.latitude, fields)
    const longitude = this.parseLongitude(data.longitude, fields)
    const batery = this.parseBatery(data.batery, fields)
    const lastCommunicationAt = this.parseDate(data.lastCommunicationAt, "lastCommunicationAt", fields)

    return {
      parsed: {
        ...(data.id !== undefined && { id: data.id }),
        name: data.name,
        type,
        latitude,
        longitude,
        status,
        ...(batery !== undefined && { batery }),
        ...(lastCommunicationAt !== undefined && { lastCommunicationAt })
      },
      fields
    }
  }

  private static validateUpdate(data: UpdateSensorDto): {
    parsed: Partial<Omit<UpdateSensorDto, "lastCommunicationAt"> & { lastCommunicationAt?: Date | null }>
    fields: ErrorFields
  } {
    const fields: ErrorFields = {}

    if (data.name !== undefined && data.name.trim().length === 0) {
      fields.name = "name nao pode ser vazio"
    }

    const type = data.type !== undefined ? this.parseType(data.type, fields) : undefined
    const status = data.status !== undefined ? this.parseStatus(data.status, fields) : undefined
    const latitude = data.latitude !== undefined ? this.parseLatitude(data.latitude, fields) : undefined
    const longitude =
      data.longitude !== undefined ? this.parseLongitude(data.longitude, fields) : undefined
    const batery = data.batery !== undefined ? this.parseBatery(data.batery, fields) : undefined
    const lastCommunicationAt =
      data.lastCommunicationAt !== undefined
        ? this.parseDate(data.lastCommunicationAt, "lastCommunicationAt", fields)
        : undefined

    return {
      parsed: {
        ...(data.name !== undefined && { name: data.name }),
        ...(type !== undefined && { type }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(status !== undefined && { status }),
        ...(batery !== undefined && { batery }),
        ...(lastCommunicationAt !== undefined && { lastCommunicationAt })
      },
      fields
    }
  }

  private static parseType(type: SensorType, fields: ErrorFields): SensorType {
    if (!SENSOR_TYPES.includes(type)) {
      fields.type = "type invalido"
      return type
    }
    return type
  }

  private static parseStatus(status: SensorStatus, fields: ErrorFields): SensorStatus {
    if (!SENSOR_STATUSES.includes(status)) {
      fields.status = "status invalido"
      return status
    }
    return status
  }

  private static parseLatitude(latitude: number, fields: ErrorFields): number {
    if (typeof latitude !== "number" || Number.isNaN(latitude)) {
      fields.latitude = "latitude e obrigatoria"
      return latitude
    }

    if (latitude < -90 || latitude > 90) {
      fields.latitude = "latitude deve estar entre -90 e 90"
    }

    return latitude
  }

  private static parseLongitude(longitude: number, fields: ErrorFields): number {
    if (typeof longitude !== "number" || Number.isNaN(longitude)) {
      fields.longitude = "longitude e obrigatoria"
      return longitude
    }

    if (longitude < -180 || longitude > 180) {
      fields.longitude = "longitude deve estar entre -180 e 180"
    }

    return longitude
  }

  private static parseOrigin(
    latitude: number | undefined,
    longitude: number | undefined,
    fields: ErrorFields
  ) {
    if (latitude === undefined && longitude === undefined) return undefined

    return {
      latitude: this.parseLatitude(latitude as number, fields),
      longitude: this.parseLongitude(longitude as number, fields)
    }
  }

  private static parseBatery(batery: number | null | undefined, fields: ErrorFields) {
    if (batery === undefined) return undefined
    if (batery === null) return null

    if (typeof batery !== "number" || Number.isNaN(batery)) {
      fields.batery = "batery deve ser um numero"
      return batery
    }

    if (batery < 0 || batery > 100) {
      fields.batery = "batery deve estar entre 0 e 100"
    }

    return Math.trunc(batery)
  }

  private static parseDate(
    value: Date | string | null | undefined,
    field: keyof ErrorFields,
    fields: ErrorFields
  ) {
    if (value === undefined) return undefined
    if (value === null) return null

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) fields[field] = `${String(field)} invalido`
      return value
    }

    if (typeof value !== "string") {
      fields[field] = `${String(field)} invalido`
      return value as never
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) fields[field] = `${String(field)} invalido`
    return parsed
  }
}
