"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorRepository = void 0;
const postgres_1 = require("@/config/postgres");
const crypto_1 = require("crypto");
const SENSOR_COLUMNS = `
  id,
  name,
  type,
  latitude,
  longitude,
  status,
  batery,
  "lastCommunicationAt",
  "createdAt",
  "updatedAt"
`;
class SensorRepository {
    async create(data) {
        const result = await postgres_1.pool.query(`
        INSERT INTO sensors (
          id,
          name,
          type,
          latitude,
          longitude,
          status,
          batery,
          "lastCommunicationAt",
          "createdAt",
          "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING ${SENSOR_COLUMNS}
      `, [
            data.id ?? (0, crypto_1.randomUUID)(),
            data.name,
            data.type,
            data.latitude,
            data.longitude,
            data.status,
            data.batery ?? null,
            data.lastCommunicationAt ?? null
        ]);
        return result.rows[0];
    }
    async findById(id) {
        const result = await postgres_1.pool.query(`
        SELECT ${SENSOR_COLUMNS}
        FROM sensors
        WHERE id = $1
        LIMIT 1
      `, [id]);
        return result.rows[0] ?? null;
    }
    async update(id, data) {
        const values = [];
        const assignments = [];
        this.addAssignment(assignments, values, "name", data.name);
        this.addAssignment(assignments, values, "type", data.type);
        this.addAssignment(assignments, values, "latitude", data.latitude);
        this.addAssignment(assignments, values, "longitude", data.longitude);
        this.addAssignment(assignments, values, "status", data.status);
        this.addAssignment(assignments, values, "batery", data.batery);
        this.addAssignment(assignments, values, '"lastCommunicationAt"', data.lastCommunicationAt);
        if (assignments.length === 0) {
            return this.findById(id);
        }
        values.push(id);
        const result = await postgres_1.pool.query(`
        UPDATE sensors
        SET ${assignments.join(", ")}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = $${values.length}
        RETURNING ${SENSOR_COLUMNS}
      `, values);
        return result.rows[0] ?? null;
    }
    async delete(id) {
        const result = await postgres_1.pool.query(`
        DELETE FROM sensors
        WHERE id = $1
        RETURNING ${SENSOR_COLUMNS}
      `, [id]);
        return result.rows[0] ?? null;
    }
    async findMany(params) {
        const { whereSql, values } = this.buildWhere(params.where);
        values.push(params.take, params.skip);
        const result = await postgres_1.pool.query(`
        SELECT ${SENSOR_COLUMNS}
        FROM sensors
        ${whereSql}
        ORDER BY "createdAt" DESC
        LIMIT $${values.length - 1}
        OFFSET $${values.length}
      `, values);
        return result.rows;
    }
    async count(where) {
        const { whereSql, values } = this.buildWhere(where);
        const result = await postgres_1.pool.query(`
        SELECT COUNT(*) AS total
        FROM sensors
        ${whereSql}
      `, values);
        return Number(result.rows[0]?.total ?? 0);
    }
    addAssignment(assignments, values, column, value) {
        if (value === undefined)
            return;
        values.push(value);
        assignments.push(`${column} = $${values.length}`);
    }
    buildWhere(where) {
        const values = [];
        const clauses = [];
        if (where.type) {
            values.push(where.type);
            clauses.push(`type = $${values.length}`);
        }
        if (where.status) {
            values.push(where.status);
            clauses.push(`status = $${values.length}`);
        }
        return {
            whereSql: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
            values
        };
    }
}
exports.SensorRepository = SensorRepository;
