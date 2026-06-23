import { WeatherService } from "@/services/weather.service";
import { AIService, WeatherReportMetrics } from "@/services/aiService";
import { AppError } from "@/types/error";
import { Request, Response } from "express";

type QueryValue = string | string[];

export async function getWeatherForecast(req: Request, res: Response) {
  const query = normalizeQuery(req.query);

  if (!query.latitude || !query.longitude) {
    throw new AppError(
      "Latitude e longitude sao obrigatorias",
      400,
      "WEATHER_COORDINATES_REQUIRED",
      {
        latitude: "Informe a latitude",
        longitude: "Informe a longitude"
      }
    );
  }

  const response = await WeatherService.getForecast(query);

  return res.json(response);
}

export async function getWeatherArchive(req: Request, res: Response) {
  const query = normalizeQuery(req.query);

  if (!query.latitude || !query.longitude) {
    throw new AppError(
      "Latitude e longitude sao obrigatorias",
      400,
      "WEATHER_COORDINATES_REQUIRED",
      {
        latitude: "Informe a latitude",
        longitude: "Informe a longitude"
      }
    );
  }

  const response = await WeatherService.getArchive(query);

  return res.json(response);
}

function normalizeQuery(query: Request["query"]): Record<string, QueryValue> {
  const normalized: Record<string, QueryValue> = {};

  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === "string") {
      normalized[key] = value;
      return;
    }

    if (Array.isArray(value)) {
      const values = value.filter(
        (item): item is string => typeof item === "string"
      );

      if (values.length > 0) {
        normalized[key] = values;
      }
    }
  });

  return normalized;
}

export async function getWeatherTextReport(req: Request, res: Response){
  const input = getReportInput(req);
  const latitude = toStringValue(input.latitude);
  const longitude = toStringValue(input.longitude);
  const neighborhood = toStringValue(input.neighborhood) || "Regiao Cadastrada";
  const metrics = normalizeMetrics(input.metrics);

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Coordenadas necessarias" });
  }

  const weatherData = await WeatherService.getForecast({
    latitude,
    longitude,
    hourly: "temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m",
    forecast_days: "1",
    timezone: "auto"
  });

  const reportText = await AIService.generateReportText(
    weatherData,
    neighborhood,
    metrics
  );

  return res.json({ report: reportText });
}

function getReportInput(req: Request): Record<string, unknown> {
  if (req.method === "POST" && req.body && typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }

  return req.query as Record<string, unknown>;
}

function toStringValue(value: unknown): string | undefined {
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

function normalizeMetrics(value: unknown): WeatherReportMetrics | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const metrics = value as Record<string, unknown>;

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

function toMetricValue(value: unknown): number | string | null | undefined {
  if (value === null) {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return toStringValue(value);
}
