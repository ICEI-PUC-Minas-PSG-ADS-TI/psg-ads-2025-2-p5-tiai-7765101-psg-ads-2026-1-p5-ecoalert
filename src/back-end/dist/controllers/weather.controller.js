"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeatherForecast = getWeatherForecast;
exports.getWeatherArchive = getWeatherArchive;
const weather_service_1 = require("@/services/weather.service");
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
