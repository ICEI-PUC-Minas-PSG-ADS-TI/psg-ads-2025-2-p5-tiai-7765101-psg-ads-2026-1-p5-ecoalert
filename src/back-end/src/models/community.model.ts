export interface Community {
  id: string
  name: string
  city: string
  state: string
  latitude?: number
  longitude?: number
  riskLevel: string
  approximatePopulation?: number
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateCommunityDto {
  name: string
  city: string
  state: string
  latitude?: number
  longitude?: number
  riskLevel: string
  approximatePopulation?: number
  description?: string
}