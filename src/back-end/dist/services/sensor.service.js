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
            throw new error_1.AppError("Dados invalidos", 400, "SENSOR_VALIDATION_ERROR", fields);
        }
        return repository.create(parsed);
    }
    static async findAll(query) {
        const fields = {};
        if (query.type)
            this.parseType(query.type, fields);
        if (query.status)
            this.parseStatus(query.status, fields);
        if (Object.keys(fields).length > 0) {
            throw new error_1.AppError("Dados invalidos", 400, "SENSOR_VALIDATION_ERROR", fields);
        }
        const where = {
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
            throw new error_1.AppError("Sensor nao encontrado", 404, "SENSOR_NOT_FOUND");
        }
        return sensor;
    }
    static async update(id, data) {
        const sensor = await repository.findById(id);
        if (!sensor) {
            throw new error_1.AppError("Sensor nao encontrado", 404, "SENSOR_NOT_FOUND");
        }
        const { parsed, fields } = this.validateUpdate(data);
        if (Object.keys(fields).length > 0) {
            throw new error_1.AppError("Dados invalidos", 400, "SENSOR_VALIDATION_ERROR", fields);
        }
        return repository.update(id, parsed);
    }
    static async delete(id) {
        const sensor = await repository.findById(id);
        if (!sensor) {
            throw new error_1.AppError("Sensor nao encontrado", 404, "SENSOR_NOT_FOUND");
        }
        return repository.delete(id);
    }
    static validateCreate(data) {
        const fields = {};
        if (!data.name)
            fields.name = "name e obrigatorio";
        if (!data.type)
            fields.type = "type e obrigatorio";
        if (!data.status)
            fields.status = "status e obrigatorio";
        const type = this.parseType(data.type, fields);
        const status = this.parseStatus(data.status, fields);
        const latitude = this.parseLatitude(data.latitude, fields);
        const longitude = this.parseLongitude(data.longitude, fields);
        const batery = this.parseBatery(data.batery, fields);
        const lastCommunicationAt = this.parseDate(data.lastCommunicationAt, "lastCommunicationAt", fields);
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
        };
    }
    static validateUpdate(data) {
        const fields = {};
        if (data.name !== undefined && data.name.trim().length === 0) {
            fields.name = "name nao pode ser vazio";
        }
        const type = data.type !== undefined ? this.parseType(data.type, fields) : undefined;
        const status = data.status !== undefined ? this.parseStatus(data.status, fields) : undefined;
        const latitude = data.latitude !== undefined ? this.parseLatitude(data.latitude, fields) : undefined;
        const longitude = data.longitude !== undefined ? this.parseLongitude(data.longitude, fields) : undefined;
        const batery = data.batery !== undefined ? this.parseBatery(data.batery, fields) : undefined;
        const lastCommunicationAt = data.lastCommunicationAt !== undefined
            ? this.parseDate(data.lastCommunicationAt, "lastCommunicationAt", fields)
            : undefined;
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
        };
    }
    static parseType(type, fields) {
        if (!sensor_model_1.SENSOR_TYPES.includes(type)) {
            fields.type = "type invalido";
            return type;
        }
        return type;
    }
    static parseStatus(status, fields) {
        if (!sensor_model_1.SENSOR_STATUSES.includes(status)) {
            fields.status = "status invalido";
            return status;
        }
        return status;
    }
    static parseLatitude(latitude, fields) {
        if (typeof latitude !== "number" || Number.isNaN(latitude)) {
            fields.latitude = "latitude e obrigatoria";
            return latitude;
        }
        if (latitude < -90 || latitude > 90) {
            fields.latitude = "latitude deve estar entre -90 e 90";
        }
        return latitude;
    }
    static parseLongitude(longitude, fields) {
        if (typeof longitude !== "number" || Number.isNaN(longitude)) {
            fields.longitude = "longitude e obrigatoria";
            return longitude;
        }
        if (longitude < -180 || longitude > 180) {
            fields.longitude = "longitude deve estar entre -180 e 180";
        }
        return longitude;
    }
    static parseBatery(batery, fields) {
        if (batery === undefined)
            return undefined;
        if (batery === null)
            return null;
        if (typeof batery !== "number" || Number.isNaN(batery)) {
            fields.batery = "batery deve ser um numero";
            return batery;
        }
        if (batery < 0 || batery > 100) {
            fields.batery = "batery deve estar entre 0 e 100";
        }
        return Math.trunc(batery);
    }
    static parseDate(value, field, fields) {
        if (value === undefined)
            return undefined;
        if (value === null)
            return null;
        if (value instanceof Date) {
            if (Number.isNaN(value.getTime()))
                fields[field] = `${String(field)} invalido`;
            return value;
        }
        if (typeof value !== "string") {
            fields[field] = `${String(field)} invalido`;
            return value;
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime()))
            fields[field] = `${String(field)} invalido`;
        return parsed;
    }
}
exports.SensorService = SensorService;
