"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorService = void 0;
const sensor_model_1 = require("@/models/sensor.model");
const sensor_repository_1 = require("@/repositories/sensor.repository");
const error_1 = require("@/types/error");
const repository = new sensor_repository_1.SensorRepository();
class SensorService {
    static async create(data) {
        const { parsed, fields } = this.validateCreate(data);
        if (Object.keys(fields).length > 0) {
            throw new error_1.AppError("Dados inválidos", 400, "SENSOR_VALIDATION_ERROR", fields);
        }
        return repository.create(parsed);
    }
    static async findAll(query) {
        const where = {
            ...(query.organizationId ? { organizationId: query.organizationId } : {}),
            ...(query.type ? { type: query.type } : {}),
            ...(query.status ? { status: query.status } : {})
        };
        const skip = (query.page - 1) * query.perPage;
        const take = query.perPage;
        const [items, total] = await Promise.all([
            repository.findMany({ where, skip, take }),
            repository.count(where)
        ]);
        return {
            items,
            page: query.page,
            perPage: query.perPage,
            total
        };
    }
    static async findById(id) {
        const sensor = await repository.findById(id);
        if (!sensor) {
            throw new error_1.AppError("Sensor não encontrado", 404, "SENSOR_NOT_FOUND");
        }
        return sensor;
    }
    static async update(id, data) {
        const sensor = await repository.findById(id);
        if (!sensor) {
            throw new error_1.AppError("Sensor não encontrado", 404, "SENSOR_NOT_FOUND");
        }
        const { parsed, fields } = this.validateUpdate(data);
        if (Object.keys(fields).length > 0) {
            throw new error_1.AppError("Dados inválidos", 400, "SENSOR_VALIDATION_ERROR", fields);
        }
        return repository.update(id, parsed);
    }
    static async delete(id) {
        const sensor = await repository.findById(id);
        if (!sensor) {
            throw new error_1.AppError("Sensor não encontrado", 404, "SENSOR_NOT_FOUND");
        }
        return repository.delete(id);
    }
    static validateCreate(data) {
        const fields = {};
        if (!data.organizationId)
            fields.organizationId = "organizationId é obrigatório";
        if (!data.name)
            fields.name = "name é obrigatório";
        if (!data.type)
            fields.type = "type é obrigatório";
        if (!data.status)
            fields.status = "status é obrigatório";
        const type = this.parseType(data.type, fields);
        const status = this.parseStatus(data.status, fields);
        const latitude = this.parseLatitude(data.latitude, fields);
        const longitude = this.parseLongitude(data.longitude, fields);
        const batteryLevel = this.parseBatteryLevel(data.batteryLevel, fields);
        const lastCommunicationAt = this.parseDate(data.lastCommunicationAt, "lastCommunicationAt", fields);
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
        };
    }
    static validateUpdate(data) {
        const fields = {};
        const type = data.type !== undefined ? this.parseType(data.type, fields) : undefined;
        const status = data.status !== undefined ? this.parseStatus(data.status, fields) : undefined;
        const latitude = data.latitude !== undefined ? this.parseLatitude(data.latitude, fields) : undefined;
        const longitude = data.longitude !== undefined ? this.parseLongitude(data.longitude, fields) : undefined;
        const batteryLevel = data.batteryLevel !== undefined ? this.parseBatteryLevel(data.batteryLevel, fields) : undefined;
        const lastCommunicationAt = data.lastCommunicationAt !== undefined
            ? this.parseDate(data.lastCommunicationAt, "lastCommunicationAt", fields)
            : undefined;
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
        };
    }
    static parseType(type, fields) {
        if (!sensor_model_1.SENSOR_TYPES.includes(type)) {
            fields.type = "type inválido";
            return type;
        }
        return type;
    }
    static parseStatus(status, fields) {
        if (!sensor_model_1.SENSOR_STATUSES.includes(status)) {
            fields.status = "status inválido";
            return status;
        }
        return status;
    }
    static parseLatitude(latitude, fields) {
        if (typeof latitude !== "number" || Number.isNaN(latitude)) {
            fields.latitude = "latitude é obrigatória";
            return latitude;
        }
        if (latitude < -90 || latitude > 90)
            fields.latitude = "latitude deve estar entre -90 e 90";
        return latitude;
    }
    static parseLongitude(longitude, fields) {
        if (typeof longitude !== "number" || Number.isNaN(longitude)) {
            fields.longitude = "longitude é obrigatória";
            return longitude;
        }
        if (longitude < -180 || longitude > 180) {
            fields.longitude = "longitude deve estar entre -180 e 180";
        }
        return longitude;
    }
    static parseBatteryLevel(batteryLevel, fields) {
        if (batteryLevel === undefined)
            return undefined;
        if (batteryLevel === null)
            return null;
        if (typeof batteryLevel !== "number" || Number.isNaN(batteryLevel)) {
            fields.batteryLevel = "batteryLevel deve ser um número";
            return batteryLevel;
        }
        if (batteryLevel < 0 || batteryLevel > 100) {
            fields.batteryLevel = "batteryLevel deve estar entre 0 e 100";
        }
        return Math.trunc(batteryLevel);
    }
    static parseDate(value, field, fields) {
        if (value === undefined)
            return undefined;
        if (value === null)
            return null;
        if (value instanceof Date) {
            if (Number.isNaN(value.getTime()))
                fields[field] = `${String(field)} inválido`;
            return value;
        }
        if (typeof value !== "string") {
            fields[field] = `${String(field)} inválido`;
            return value;
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime()))
            fields[field] = `${String(field)} inválido`;
        return parsed;
    }
}
exports.SensorService = SensorService;
