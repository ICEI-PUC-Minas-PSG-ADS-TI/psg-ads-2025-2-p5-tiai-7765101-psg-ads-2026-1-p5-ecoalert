"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommunity = createCommunity;
exports.getCommunities = getCommunities;
exports.getCommunityById = getCommunityById;
exports.updateCommunity = updateCommunity;
exports.deleteCommunity = deleteCommunity;
const community_service_1 = require("@/services/community.service");
async function createCommunity(req, res) {
    try {
        const response = await community_service_1.CommunityService.create(req.body);
        return res.json(response);
    }
    catch (error) {
        return res.json({ message: "Erro ao criar comunidade" });
    }
}
async function getCommunities(req, res) {
    try {
        const communities = await community_service_1.CommunityService.findAll();
        return res.json(communities);
    }
    catch (error) {
        return res.json({ message: "Erro ao criar comunidade" });
    }
}
async function getCommunityById(req, res) {
    try {
        const { id } = req.params;
        const community = await community_service_1.CommunityService.findById(id);
        return res.json(community);
    }
    catch (error) {
        return res.json({ message: "Erro ao buscar comunidade" });
    }
}
async function updateCommunity(req, res) {
    try {
        const { id } = req.params;
        const community = await community_service_1.CommunityService.update(id, req.body);
        return res.json(community);
    }
    catch (error) {
        return res.json({ message: "Erro ao atualizar comunidade" });
    }
}
async function deleteCommunity(req, res) {
    try {
        const { id } = req.params;
        await community_service_1.CommunityService.delete(id);
        return res.json({ message: "Comunidade deletada com sucesso" });
    }
    catch (error) {
        return res.json({ message: "Erro ao deletar comunidade" });
    }
}
