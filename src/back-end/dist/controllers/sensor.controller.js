"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSensor = createSensor;
exports.getSensors = getSensors;
exports.getSensorById = getSensorById;
exports.updateSensor = updateSensor;
exports.deleteSensor = deleteSensor;
const sensor_model_1 = require("@/models/sensor.model");
const sensor_service_1 = require("@/services/sensor.service");
async function createSensor(req, res) {
    const created = await sensor_service_1.SensorService.create(req.body);
    return res.status(201).json(created);
}
async function getSensors(req, res) {
    const page = parsePositiveInt(req.query.page, 1, 1000000);
    const perPage = parsePositiveInt(req.query.perPage, 10, 100);
    const type = parseOptionalString(req.query.type);
    const status = parseOptionalString(req.query.status);
    const result = await sensor_service_1.SensorService.findAll({
        ...(type ? { type: parseSensorType(type) } : {}),
        ...(status ? { status: parseSensorStatus(status) } : {}),
        page,
        perPage
    });
    return res.json(result);
}
async function getSensorById(req, res) {
    const { id } = req.params;
    return res.json(await sensor_service_1.SensorService.findById(id));
}
async function updateSensor(req, res) {
    const { id } = req.params;
    return res.json(await sensor_service_1.SensorService.update(id, req.body));
}
async function deleteSensor(req, res) {
    const { id } = req.params;
    await sensor_service_1.SensorService.delete(id);
    return res.json({ message: "Sensor deletado com sucesso" });
}
function parseOptionalString(value) {
    if (typeof value === "string" && value.trim().length > 0)
        return value;
    return undefined;
}
function parsePositiveInt(value, fallback, max) {
    if (typeof value !== "string")
        return fallback;
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 1)
        return fallback;
    if (parsed > max)
        return max;
    return parsed;
}
function parseSensorType(value) {
    if (sensor_model_1.SENSOR_TYPES.includes(value))
        return value;
    return value;
}
function parseSensorStatus(value) {
    if (sensor_model_1.SENSOR_STATUSES.includes(value))
        return value;
    return value;
}
