"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorRepository = void 0;
const database_1 = require("@/config/database");
class SensorRepository {
    async create(data) {
        return database_1.prisma.sensor.create({
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
        });
    }
    async findById(id) {
        return database_1.prisma.sensor.findUnique({
            where: { id }
        });
    }
    async update(id, data) {
        return database_1.prisma.sensor.update({
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
        });
    }
    async delete(id) {
        return database_1.prisma.sensor.delete({
            where: { id }
        });
    }
    async findMany(params) {
        return database_1.prisma.sensor.findMany({
            where: params.where,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" }
        });
    }
    async count(where) {
        return database_1.prisma.sensor.count({
            where
        });
    }
}
exports.SensorRepository = SensorRepository;
