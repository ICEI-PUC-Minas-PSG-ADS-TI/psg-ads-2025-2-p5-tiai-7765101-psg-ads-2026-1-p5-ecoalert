export type NeighborhoodGeometryInput =
  | {
      geojson: unknown
    }
  | {
      wkt: string
    }

export interface Neighborhood {
  id: number
  geom: unknown | null
  cdSetor: string | null
  cdSit: string | null
  nmSit: string | null
  cdUf: string | null
  nmUf: string | null
  siglaUf: string | null
  cdMun: string | null
  nmMun: string | null
  cdDist: string | null
  nmDist: string | null
  cdSubdist: string | null
  nmSubdist: string | null
}

export interface CreateNeighborhoodDto {
  id?: number
  geom?: NeighborhoodGeometryInput | null
  cdSetor?: string | null
  cdSit?: string | null
  nmSit?: string | null
  cdUf?: string | null
  nmUf?: string | null
  siglaUf?: string | null
  cdMun?: string | null
  nmMun?: string | null
  cdDist?: string | null
  nmDist?: string | null
  cdSubdist?: string | null
  nmSubdist?: string | null
}

export type UpdateNeighborhoodDto = Partial<CreateNeighborhoodDto>
