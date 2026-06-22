import { api } from "@/api/axios"
import { Address } from "@/types/shared"
import { AppError } from "@/types/error"

const NOMINATIM_BASE_URL =
  process.env.NOMINATIM_BASE_URL ?? "https://nominatim.openstreetmap.org"

const NOMINATIM_HEADERS = {
  "User-Agent": process.env.NOMINATIM_USER_AGENT ?? "EcoAlert-PUC-Minas/1.0",
  "Accept-Language": "pt-BR,pt;q=0.9"
}

export type GeocodingAddress = Partial<Address> & {
  country?: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

interface NominatimAddress {
  house_number?: string
  road?: string
  pedestrian?: string
  footway?: string
  path?: string
  neighbourhood?: string
  suburb?: string
  quarter?: string
  city_district?: string
  district?: string
  city?: string
  town?: string
  village?: string
  municipality?: string
  state?: string
  postcode?: string
}

interface NominatimResult {
  lat: string
  lon: string
  display_name: string
  address?: NominatimAddress
}

export class GeolocationService {
  static async getCoordinatesFromAddress(
    address: GeocodingAddress
  ): Promise<Coordinates | null> {
    if (!address || (!address.street && !address.cep)) {
      return null
    }

    const query = this.buildAddressQuery(address)

    try {
      const response = await api.get<NominatimResult[]>(
        `${NOMINATIM_BASE_URL}/search`,
        {
          params: {
            q: query,
            format: "jsonv2",
            limit: 1,
            countrycodes: "br"
          },
          headers: NOMINATIM_HEADERS
        }
      )

      const result = response.data[0]

      if (!result) {
        return null
      }

      return {
        latitude: Number(result.lat),
        longitude: Number(result.lon)
      }
    } catch (error: unknown) {
      throw this.createNominatimError(error)
    }
  }

  static async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<Address | null> {
    this.validateCoordinates(latitude, longitude)

    try {
      const response = await api.get<NominatimResult>(
        `${NOMINATIM_BASE_URL}/reverse`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: "jsonv2",
            addressdetails: 1,
            zoom: 18
          },
          headers: NOMINATIM_HEADERS
        }
      )

      const result = response.data

      if (!result?.address) {
        return null
      }

      const address = result.address

      return {
        cep: address.postcode ?? "",
        street:
          address.road ??
          address.pedestrian ??
          address.footway ??
          address.path ??
          "",
        neighborhood:
          address.neighbourhood ??
          address.suburb ??
          address.quarter ??
          address.city_district ??
          address.district ??
          "",
        city:
          address.city ??
          address.town ??
          address.village ??
          address.municipality ??
          "",
        state: address.state ?? null,
        number: address.house_number ?? ""
      }
    } catch (error: unknown) {
      if (this.isNotFoundError(error)) {
        return null
      }

      if (error instanceof AppError) {
        throw error
      }

      throw this.createNominatimError(error)
    }
  }

  private static buildAddressQuery(address: GeocodingAddress): string {
    const street = [address.street, address.number].filter(Boolean).join(", ")

    return [
      street,
      address.neighborhood,
      address.city || "Belo Horizonte",
      address.state || "Minas Gerais",
      address.cep,
      address.country || "Brazil"
    ]
      .filter(Boolean)
      .join(", ")
  }

  private static validateCoordinates(
    latitude: number,
    longitude: number
  ): void {
    const fields: Record<string, string> = {}

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      fields.latitude = "Latitude deve estar entre -90 e 90"
    }

    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      fields.longitude = "Longitude deve estar entre -180 e 180"
    }

    if (Object.keys(fields).length > 0) {
      throw new AppError(
        "Coordenadas invalidas",
        400,
        "INVALID_COORDINATES",
        fields
      )
    }
  }

  private static isNotFoundError(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    )
  }

  private static createNominatimError(error: unknown): AppError {
    const response =
      typeof error === "object" && error !== null && "response" in error
        ? (error as {
            response?: {
              status?: number
              data?: { error?: string }
            }
          }).response
        : undefined

    return new AppError(
      "Erro ao consultar servico de geolocalizacao",
      response?.status ?? 500,
      "NOMINATIM_REQUEST_ERROR",
      {
        nominatim:
          response?.data?.error ?? "Falha ao consultar o Nominatim"
      }
    )
  }
}
