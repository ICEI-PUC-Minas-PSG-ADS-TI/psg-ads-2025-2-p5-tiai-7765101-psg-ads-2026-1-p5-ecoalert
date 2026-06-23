"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeatherForecast = getWeatherForecast;
exports.getWeatherArchive = getWeatherArchive;
exports.getWeatherTextReport = getWeatherTextReport;
const weather_service_1 = require("@/services/weather.service");
const aiService_1 = require("@/services/aiService");
const error_1 = require("@/types/error");
async function getWeatherForecast(req, res) {
    const query = normalizeQuery(req.query);
    if (!query.latitude || !query.longitude) {
        throw new error_1.AppError("Latitude e longitude sao obrigatorias", 400, "WEATHER_COORDINATES_REQUIRED", {
            latitude: "Informe a latitude",
            longitude: "Informe a longitude"
        });
    }
    const response = await weather_service_1.WeatherService.getForecast(query);
    return res.json(response);
}
async function getWeatherArchive(req, res) {
    const query = normalizeQuery(req.query);
    if (!query.latitude || !query.longitude) {
        throw new error_1.AppError("Latitude e longitude sao obrigatorias", 400, "WEATHER_COORDINATES_REQUIRED", {
            latitude: "Informe a latitude",
            longitude: "Informe a longitude"
        });
    }
    const response = await weather_service_1.WeatherService.getArchive(query);
    return res.json(response);
}
function normalizeQuery(query) {
    const normalized = {};
    Object.entries(query).forEach(([key, value]) => {
        if (typeof value === "string") {
            normalized[key] = value;
            return;
        }
        if (Array.isArray(value)) {
            const values = value.filter((item) => typeof item === "string");
            if (values.length > 0) {
                normalized[key] = values;
            }
        }
    });
    return normalized;
}
async function getWeatherTextReport(req, res) {
    const input = getReportInput(req);
    const latitude = toStringValue(input.latitude);
    const longitude = toStringValue(input.longitude);
    const neighborhood = toStringValue(input.neighborhood) || "Regiao Cadastrada";
    const metrics = normalizeMetrics(input.metrics);
    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Coordenadas necessarias" });
    }
    const weatherData = await weather_service_1.WeatherService.getForecast({
        latitude,
        longitude,
        hourly: "temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m",
        forecast_days: "1",
        timezone: "auto"
    });
    const reportText = await aiService_1.AIService.generateReportText(weatherData, neighborhood, metrics);
    return res.json({ report: reportText });
}
function getReportInput(req) {
    if (req.method === "POST" && req.body && typeof req.body === "object") {
        return req.body;
    }
    return req.query;
}
function toStringValue(value) {
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }
    if (Array.isArray(value)) {
        const firstValue = value.find((item) => typeof item === "string" || typeof item === "number");
        return toStringValue(firstValue);
    }
    return undefined;
}
function normalizeMetrics(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return undefined;
    }
    const metrics = value;
    return {
        periodLabel: toStringValue(metrics.periodLabel),
        currentTemperature: toMetricValue(metrics.currentTemperature),
        maxTemperature: toMetricValue(metrics.maxTemperature),
        minTemperature: toMetricValue(metrics.minTemperature),
        totalRain: toMetricValue(metrics.totalRain),
        maxWindGust: toMetricValue(metrics.maxWindGust),
        averageWindSpeed: toMetricValue(metrics.averageWindSpeed),
        riskStatus: toStringValue(metrics.riskStatus),
        riskDescription: toStringValue(metrics.riskDescription),
        dataPoints: toMetricValue(metrics.dataPoints),
        locationSource: toStringValue(metrics.locationSource),
        generatedAt: toStringValue(metrics.generatedAt)
    };
}
function toMetricValue(value) {
    if (value === null) {
        return null;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    return toStringValue(value);
}
