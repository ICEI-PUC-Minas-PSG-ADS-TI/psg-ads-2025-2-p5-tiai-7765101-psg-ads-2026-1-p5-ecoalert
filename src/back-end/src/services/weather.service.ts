import { api } from "@/api/axios";
import { AppError } from "@/types/error";

type WeatherQueryValue = string | string[];

export class WeatherService {
  static async getForecast(query: Record<string, WeatherQueryValue>) {
    try {
      const response = await api.get(`${process.env.OPEN_METEO_FORECAST_BASE_URL}/forecast`, {
        params: query
      });

      return response.data;
    } catch (error: any) {
      const status = error?.response?.status ?? 500;
      const data = error?.response?.data;

      throw new AppError(
        "Erro ao buscar dados meteorologicos",
        status,
        "OPEN_METEO_REQUEST_ERROR",
        {
          openMeteo: data?.reason ?? data?.error ?? "Falha ao consultar Open-Meteo"
        }
      );
    }
  }

  static async getArchive(query: Record<string, WeatherQueryValue>) {
    try {
      const response = await api.get(`${process.env.OPEN_METEO_ARCHIVE_BASE_URL}/archive`, {
        params: query
      });

      return response.data;
    } catch (error: any) {
      const status = error?.response?.status ?? 500;
      const data = error?.response?.data;

      throw new AppError(
        "Erro ao buscar dados meteorologicos",
        status,
        "OPEN_METEO_REQUEST_ERROR",
        {
          openMeteo: data?.reason ?? data?.error ?? "Falha ao consultar Open-Meteo"
        }
      );
    }
  }
}
