"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const axios_1 = require("@/api/axios");
const error_1 = require("@/types/error");
class WeatherService {
    static async getForecast(query) {
        try {
            const response = await axios_1.api.get(`${process.env.OPEN_METEO_FORECAST_BASE_URL}/forecast`, {
                params: query
            });
            return response.data;
        }
        catch (error) {
            const status = error?.response?.status ?? 500;
            const data = error?.response?.data;
            throw new error_1.AppError("Erro ao buscar dados meteorologicos", status, "OPEN_METEO_REQUEST_ERROR", {
                openMeteo: data?.reason ?? data?.error ?? "Falha ao consultar Open-Meteo"
            });
        }
    }
    static async getArchive(query) {
        try {
            const response = await axios_1.api.get(`${process.env.OPEN_METEO_ARCHIVE_BASE_URL}/archive`, {
                params: query
            });
            return response.data;
        }
        catch (error) {
            const status = error?.response?.status ?? 500;
            const data = error?.response?.data;
            throw new error_1.AppError("Erro ao buscar dados meteorologicos", status, "OPEN_METEO_REQUEST_ERROR", {
                openMeteo: data?.reason ?? data?.error ?? "Falha ao consultar Open-Meteo"
            });
        }
    }
}
exports.WeatherService = WeatherService;
