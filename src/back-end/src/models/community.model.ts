export interface Community {
  id: string
  name: string
  city: string
  state: string
  latitude?: number | null
  longitude?: number | null
  riskLevel: string
  population?: number | null
  description?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateCommunityDto {
  name: string
  city: string
  state: string
  latitude?: number | null
  longitude?: number | null
  riskLevel: string
  population?: number | null
  description?: string | null
}