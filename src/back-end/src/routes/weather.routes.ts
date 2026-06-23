import { getWeatherArchive, getWeatherForecast, getWeatherTextReport } from "@/controllers/weather.controller";
import { errorHandler } from "@/utils/errorHandler";
import { Router } from "express";

const weatherRoutes = Router();

weatherRoutes.get("/forecast", errorHandler(getWeatherForecast));
weatherRoutes.get("/archive", errorHandler(getWeatherArchive));
weatherRoutes.get("/report", errorHandler(getWeatherTextReport));
weatherRoutes.post("/report", errorHandler(getWeatherTextReport));

export { weatherRoutes };
