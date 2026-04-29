"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityRepository = void 0;
const database_1 = require("@/config/database");
class CommunityRepository {
    async create(data) {
        return database_1.prisma.community.create({
            data
        });
    }
    async findAll() {
        return database_1.prisma.community.findMany();
    }
    async findById(id) {
        return database_1.prisma.community.findUnique({
            where: { id }
        });
    }
    async findByName(name) {
        return database_1.prisma.community.findFirst({
            where: { name }
        });
    }
    async update(id, data) {
        return database_1.prisma.community.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return database_1.prisma.community.delete({
            where: { id }
        });
    }
}
exports.CommunityRepository = CommunityRepository;
