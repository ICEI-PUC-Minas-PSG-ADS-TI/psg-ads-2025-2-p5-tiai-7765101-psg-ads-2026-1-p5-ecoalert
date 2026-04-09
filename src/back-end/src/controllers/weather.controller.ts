import { WeatherService } from "@/services/weather.service";
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