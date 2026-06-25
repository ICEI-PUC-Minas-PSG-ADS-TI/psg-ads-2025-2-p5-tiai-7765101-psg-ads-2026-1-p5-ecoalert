import { api } from "@/api/axios"
import { AppError } from "@/types/error"

type NominatimReverseResponse = {
  address?: {
    postcode?: string
    road?: string
    suburb?: string
    city?: string
    state?: string
  }
}

type ViaCepResponse = {
  cep?: string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  estado?: string
  erro?: boolean
}

export type CoordinatesAddress = {
  cep: string
  street: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
}

const NOMINATIM_REVERSE_URL =
  process.env.NOMINATIM_REVERSE_URL ?? "https://nominatim.openstreetmap.org/reverse"
const NOMINATIM_USER_AGENT =
  process.env.NOMINATIM_USER_AGENT ?? "EcoAlert/2.0"
const NOMINATIM_RATE_LIMIT_DELAY_MS = 20000
const VIACEP_BASE_URL = process.env.VIACEP_BASE_URL ?? "https://viacep.com.br/ws"

export class GeolocationService {
  static async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<CoordinatesAddress | null> {
    return await this.getCepFromCoordinates(latitude, longitude)
  }

  private static async getCepFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<CoordinatesAddress | null> {
    while (true) {
      try {
        const response = await api.get<NominatimReverseResponse>(
          NOMINATIM_REVERSE_URL,
          {
            params: {
              format: "jsonv2",
              lat: latitude,
              lon: longitude,
              addressdetails: 1
            },
            headers: {
              "User-Agent": NOMINATIM_USER_AGENT
            }
          }
        )

        const address = response.data.address;

        console.log("Extracted address from Nominatim response:", address);

        return {
          cep: address?.postcode?.replace(/\D/g, "") || "",
          street: address?.road ?? null,
          neighborhood: address?.suburb ?? null,
          city: address?.city ?? null,
          state: address?.state ?? null
        }
      } catch (error) {
        if (getHttpStatus(error) === 429) {
          console.warn(
            `Nominatim retornou 429. Aguardando ${NOMINATIM_RATE_LIMIT_DELAY_MS}ms antes de continuar.`
          )
          await sleep(NOMINATIM_RATE_LIMIT_DELAY_MS)
          continue
        }

        throw toAppError(
          error,
          "Erro ao buscar CEP no Nominatim",
          "NOMINATIM_REQUEST_ERROR"
        )
      }
    }
  }

  private static async getAddressByCep(cep: string): Promise<CoordinatesAddress> {
    try {
      const response = await api.get<ViaCepResponse>(
        `${VIACEP_BASE_URL}/${cep}/json/`
      )

      if (response.data.erro) {
        throw new AppError("CEP nao encontrado no ViaCEP", 404, "VIACEP_NOT_FOUND")
      }

      return {
        cep,
        street: normalize(response.data.logradouro),
        neighborhood: normalize(response.data.bairro),
        city: normalize(response.data.localidade),
        state: normalize(response.data.estado) ?? normalize(response.data.uf)
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      throw toAppError(
        error,
        "Erro ao buscar endereco no ViaCEP",
        "VIACEP_REQUEST_ERROR"
      )
    }
  }
}

function normalize(value?: string | null) {
  const trimmed = value?.trim()

  return trimmed || null
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getHttpStatus(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    typeof error.response.status === "number"
      ? error.response.status
      : 500
  )
}

function toAppError(error: unknown, message: string, code: string) {
  const status = getHttpStatus(error)

  return new AppError(message, status, code)
}
