import { pool } from "@/config/postgres"
import {
  CreateNeighborhoodDto,
  Neighborhood,
  NeighborhoodGeometryInput,
  UpdateNeighborhoodDto
} from "@/models/neighborhood.model"

const NEIGHBORHOOD_COLUMNS = `
  id,
  ST_AsGeoJSON(geom)::json AS geom,
  cd_setor AS "cdSetor",
  cd_sit AS "cdSit",
  nm_sit AS "nmSit",
  cd_uf AS "cdUf",
  nm_uf AS "nmUf",
  sigla_uf AS "siglaUf",
  cd_mun AS "cdMun",
  nm_mun AS "nmMun",
  cd_dist AS "cdDist",
  nm_dist AS "nmDist",
  cd_subdist AS "cdSubdist",
  nm_subdist AS "nmSubdist"
`

const COLUMN_MAP = {
  cdSetor: "cd_setor",
  cdSit: "cd_sit",
  nmSit: "nm_sit",
  cdUf: "cd_uf",
  nmUf: "nm_uf",
  siglaUf: "sigla_uf",
  cdMun: "cd_mun",
  nmMun: "nm_mun",
  cdDist: "cd_dist",
  nmDist: "nm_dist",
  cdSubdist: "cd_subdist",
  nmSubdist: "nm_subdist"
} as const

type NeighborhoodTextField = keyof typeof COLUMN_MAP

export class NeighborhoodRepository {
  async create(data: CreateNeighborhoodDto): Promise<Neighborhood> {
    const values: unknown[] = []
    const columns: string[] = []
    const placeholders: string[] = []

    if (data.id !== undefined) {
      values.push(data.id)
      columns.push("id")
      placeholders.push(`$${values.length}`)
    }

    if (data.geom !== undefined) {
      columns.push("geom")
      placeholders.push(this.toGeometrySql(data.geom, values))
    }

    this.addTextColumns(data, values, columns, placeholders)

    const insertSql =
      columns.length > 0
        ? `
          INSERT INTO neighborhoods (${columns.join(", ")})
          VALUES (${placeholders.join(", ")})
          RETURNING ${NEIGHBORHOOD_COLUMNS}
        `
        : `
          INSERT INTO neighborhoods DEFAULT VALUES
          RETURNING ${NEIGHBORHOOD_COLUMNS}
        `

    const result = await pool.query<Neighborhood>(insertSql, values)

    return result.rows[0]
  }

  async findAll(params?: { limit?: number; offset?: number }): Promise<Neighborhood[]> {
    const values: number[] = []
    const pagination = this.buildPagination(params, values)

    const result = await pool.query<Neighborhood>(
      `
        SELECT ${NEIGHBORHOOD_COLUMNS}
        FROM neighborhoods
        ORDER BY id
        ${pagination}
      `,
      values
    )

    return result.rows
  }

  async findById(id: number): Promise<Neighborhood | null> {
    const result = await pool.query<Neighborhood>(
      `
        SELECT ${NEIGHBORHOOD_COLUMNS}
        FROM neighborhoods
        WHERE id = $1
        LIMIT 1
      `,
      [id]
    )

    return result.rows[0] ?? null
  }

  async findByCoordinates(latitude: number, longitude: number): Promise<Neighborhood | null> {
    const result = await pool.query<Neighborhood>(
      `
        SELECT ${NEIGHBORHOOD_COLUMNS}
        FROM neighborhoods
        WHERE ST_Covers(geom, ST_SetSRID(ST_MakePoint($1, $2), 4674))
        LIMIT 1
      `,
      [longitude, latitude]
    )

    return result.rows[0] ?? null
  }

  async update(id: number, data: UpdateNeighborhoodDto): Promise<Neighborhood | null> {
    const values: unknown[] = []
    const assignments: string[] = []

    if (data.geom !== undefined) {
      assignments.push(`geom = ${this.toGeometrySql(data.geom, values)}`)
    }

    this.addTextAssignments(data, values, assignments)

    if (assignments.length === 0) {
      return this.findById(id)
    }

    values.push(id)

    const result = await pool.query<Neighborhood>(
      `
        UPDATE neighborhoods
        SET ${assignments.join(", ")}
        WHERE id = $${values.length}
        RETURNING ${NEIGHBORHOOD_COLUMNS}
      `,
      values
    )

    return result.rows[0] ?? null
  }

  async delete(id: number): Promise<Neighborhood | null> {
    const result = await pool.query<Neighborhood>(
      `
        DELETE FROM neighborhoods
        WHERE id = $1
        RETURNING ${NEIGHBORHOOD_COLUMNS}
      `,
      [id]
    )

    return result.rows[0] ?? null
  }

  private addTextColumns(
    data: CreateNeighborhoodDto,
    values: unknown[],
    columns: string[],
    placeholders: string[]
  ) {
    for (const [field, column] of Object.entries(COLUMN_MAP) as [NeighborhoodTextField, string][]) {
      if (data[field] !== undefined) {
        values.push(data[field])
        columns.push(column)
        placeholders.push(`$${values.length}`)
      }
    }
  }

  private addTextAssignments(
    data: UpdateNeighborhoodDto,
    values: unknown[],
    assignments: string[]
  ) {
    for (const [field, column] of Object.entries(COLUMN_MAP) as [NeighborhoodTextField, string][]) {
      if (data[field] !== undefined) {
        values.push(data[field])
        assignments.push(`${column} = $${values.length}`)
      }
    }
  }

  private toGeometrySql(geometry: NeighborhoodGeometryInput | null, values: unknown[]) {
    if (geometry === null) {
      return "NULL"
    }

    if ("wkt" in geometry) {
      values.push(geometry.wkt)
      return `ST_SetSRID(ST_GeomFromText($${values.length}), 4674)`
    }

    values.push(typeof geometry.geojson === "string" ? geometry.geojson : JSON.stringify(geometry.geojson))
    return `ST_SetSRID(ST_GeomFromGeoJSON($${values.length}), 4674)`
  }

  private buildPagination(params: { limit?: number; offset?: number } | undefined, values: number[]) {
    const clauses: string[] = []

    if (params?.limit !== undefined) {
      values.push(params.limit)
      clauses.push(`LIMIT $${values.length}`)
    }

    if (params?.offset !== undefined) {
      values.push(params.offset)
      clauses.push(`OFFSET $${values.length}`)
    }

    return clauses.join(" ")
  }
}
