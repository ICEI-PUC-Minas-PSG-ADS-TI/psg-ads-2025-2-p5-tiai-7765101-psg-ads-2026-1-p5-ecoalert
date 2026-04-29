"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityService = void 0;
const community_repository_1 = require("@/repositories/community.repository");
const error_1 = require("@/types/error");
const repository = new community_repository_1.CommunityRepository();
class CommunityService {
    static async create(data) {
        const errorFields = {};
        const communityByName = await repository.findByName(data.name);
        if (communityByName) {
            errorFields.id = "Já existe uma comunidade cadastrada com esse nome";
        }
        const comunidadeExists = Object.keys(errorFields).length > 0;
        if (comunidadeExists) {
            throw new error_1.AppError("Comunidade já cadastrada", 400, "Community already exists", errorFields);
        }
        const createdCommunity = await repository.create(data);
        return createdCommunity;
    }
    static async findAll() {
        return repository.findAll();
    }
    static async findById(id) {
        const community = await repository.findById(id);
        if (!community) {
            throw new error_1.AppError("Comunidade não encontrada", 404, "Community not found");
        }
        return community;
    }
    static async update(id, data) {
        const community = await repository.findById(id);
        if (!community) {
            throw new error_1.AppError("Comunidade não encontrada", 404, "Community not found");
        }
        return repository.update(id, data);
    }
    static async delete(id) {
        const community = await repository.findById(id);
        if (!community) {
            throw new error_1.AppError("Comunidade não encontrada", 404, "Community not found");
        }
        return repository.delete(id);
    }
}
exports.CommunityService = CommunityService;
