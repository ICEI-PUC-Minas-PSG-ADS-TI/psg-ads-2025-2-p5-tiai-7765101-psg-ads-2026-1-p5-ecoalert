import { prisma } from "@/config/database"
import { CreateSensorDto, SensorStatus, SensorType } from "@/models/sensor.model"

type SensorWhereInput = {
  organizationId?: string
  type?: SensorType
  status?: SensorStatus
}

export class SensorRepository {
  async create(data: Omit<CreateSensorDto, "lastCommunicationAt"> & { lastCommunicationAt?: Date | null }) {
    return prisma.sensor.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        type: data.type,
        organizationId: data.organizationId,
        latitude: data.latitude,
        longitude: data.longitude,
        status: data.status,
        batteryLevel: data.batteryLevel ?? null,
        lastCommunicationAt: data.lastCommunicationAt ?? null
      }
    })
  }

  async findById(id: string) {
    return prisma.sensor.findUnique({
      where: { id }
    })
  }

  async update(
    id: string,
    data: Partial<
      Omit<CreateSensorDto, "lastCommunicationAt"> & { lastCommunicationAt?: Date | null }
    >
  ) {
    return prisma.sensor.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.organizationId !== undefined && { organizationId: data.organizationId }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.batteryLevel !== undefined && { batteryLevel: data.batteryLevel }),
        ...(data.lastCommunicationAt !== undefined && {
          lastCommunicationAt: data.lastCommunicationAt
        })
      }
    })
  }

  async delete(id: string) {
    return prisma.sensor.delete({
      where: { id }
    })
  }

  async findMany(params: { where: SensorWhereInput; skip: number; take: number }) {
    return prisma.sensor.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" }
    })
  }

  async count(where: SensorWhereInput) {
    return prisma.sensor.count({
      where
    })
  }
}

