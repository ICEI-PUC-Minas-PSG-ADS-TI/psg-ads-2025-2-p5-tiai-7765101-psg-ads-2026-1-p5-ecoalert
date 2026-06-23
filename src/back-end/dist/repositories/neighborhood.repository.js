"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeighborhoodRepository = void 0;
const postgres_1 = require("@/config/postgres");
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
`;
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
};
class NeighborhoodRepository {
    async create(data) {
        const values = [];
        const columns = [];
        const placeholders = [];
        if (data.id !== undefined) {
            values.push(data.id);
            columns.push("id");
            placeholders.push(`$${values.length}`);
        }
        if (data.geom !== undefined) {
            columns.push("geom");
            placeholders.push(this.toGeometrySql(data.geom, values));
        }
        this.addTextColumns(data, values, columns, placeholders);
        const insertSql = columns.length > 0
            ? `
          INSERT INTO neighborhoods (${columns.join(", ")})
          VALUES (${placeholders.join(", ")})
          RETURNING ${NEIGHBORHOOD_COLUMNS}
        `
            : `
          INSERT INTO neighborhoods DEFAULT VALUES
          RETURNING ${NEIGHBORHOOD_COLUMNS}
        `;
        const result = await postgres_1.pool.query(insertSql, values);
        return result.rows[0];
    }
    async findAll(params) {
        const values = [];
        const pagination = this.buildPagination(params, values);
        const result = await postgres_1.pool.query(`
        SELECT ${NEIGHBORHOOD_COLUMNS}
        FROM neighborhoods
        ORDER BY id
        ${pagination}
      `, values);
        return result.rows;
    }
    async findById(id) {
        const result = await postgres_1.pool.query(`
        SELECT ${NEIGHBORHOOD_COLUMNS}
        FROM neighborhoods
        WHERE id = $1
        LIMIT 1
      `, [id]);
        return result.rows[0] ?? null;
    }
    async findByCoordinates(latitude, longitude) {
        const result = await postgres_1.pool.query(`
        SELECT ${NEIGHBORHOOD_COLUMNS}
        FROM neighborhoods
        WHERE ST_Covers(geom, ST_SetSRID(ST_MakePoint($1, $2), 4674))
        LIMIT 1
      `, [longitude, latitude]);
        return result.rows[0] ?? null;
    }
    async update(id, data) {
        const values = [];
        const assignments = [];
        if (data.geom !== undefined) {
            assignments.push(`geom = ${this.toGeometrySql(data.geom, values)}`);
        }
        this.addTextAssignments(data, values, assignments);
        if (assignments.length === 0) {
            return this.findById(id);
        }
        values.push(id);
        const result = await postgres_1.pool.query(`
        UPDATE neighborhoods
        SET ${assignments.join(", ")}
        WHERE id = $${values.length}
        RETURNING ${NEIGHBORHOOD_COLUMNS}
      `, values);
        return result.rows[0] ?? null;
    }
    async delete(id) {
        const result = await postgres_1.pool.query(`
        DELETE FROM neighborhoods
        WHERE id = $1
        RETURNING ${NEIGHBORHOOD_COLUMNS}
      `, [id]);
        return result.rows[0] ?? null;
    }
    addTextColumns(data, values, columns, placeholders) {
        for (const [field, column] of Object.entries(COLUMN_MAP)) {
            if (data[field] !== undefined) {
                values.push(data[field]);
                columns.push(column);
                placeholders.push(`$${values.length}`);
            }
        }
    }
    addTextAssignments(data, values, assignments) {
        for (const [field, column] of Object.entries(COLUMN_MAP)) {
            if (data[field] !== undefined) {
                values.push(data[field]);
                assignments.push(`${column} = $${values.length}`);
            }
        }
    }
    toGeometrySql(geometry, values) {
        if (geometry === null) {
            return "NULL";
        }
        if ("wkt" in geometry) {
            values.push(geometry.wkt);
            return `ST_SetSRID(ST_GeomFromText($${values.length}), 4674)`;
        }
        values.push(typeof geometry.geojson === "string" ? geometry.geojson : JSON.stringify(geometry.geojson));
        return `ST_SetSRID(ST_GeomFromGeoJSON($${values.length}), 4674)`;
    }
    buildPagination(params, values) {
        const clauses = [];
        if (params?.limit !== undefined) {
            values.push(params.limit);
            clauses.push(`LIMIT $${values.length}`);
        }
        if (params?.offset !== undefined) {
            values.push(params.offset);
            clauses.push(`OFFSET $${values.length}`);
        }
        return clauses.join(" ");
    }
}
exports.NeighborhoodRepository = NeighborhoodRepository;
