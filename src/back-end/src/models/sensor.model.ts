export const SENSOR_TYPES = [
  "RAIN",
  "RIVER_LEVEL",
  "SOIL_MOISTURE",
  "WEATHER",
  "TEMPERATURE",
  "HUMIDITY"
] as const

export type SensorType = (typeof SENSOR_TYPES)[number]

export const SENSOR_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "MAINTENANCE",
  "OFFLINE"
] as const

export type SensorStatus = (typeof SENSOR_STATUSES)[number]

export interface Sensor {
  id: string
  name: string
  type: SensorType
  latitude: number
  longitude: number
  status: SensorStatus
  batery?: number | null
  lastCommunicationAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateSensorDto {
  id?: string
  name: string
  type: SensorType
  latitude: number
  longitude: number
  status: SensorStatus
  batery?: number | null
  lastCommunicationAt?: Date | string | null
}

export type UpdateSensorDto = Partial<CreateSensorDto>
