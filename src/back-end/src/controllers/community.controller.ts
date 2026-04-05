import { Community } from "@/models/community.model";
import { CommunityService } from "@/services/community.service";
import { Request, Response } from "express";

type Params = {
    id: string
}

export async function createCommunity(req: Request, res: Response){
    try {
        const response: Community = await CommunityService.create(req.body);
        return res.json(response);
    }
    catch (error) {
        console.log(error);
        return res.json({ message: "Erro ao criar comunidade" });
    }
}

export async function getCommunities(req: Request, res: Response) {
    try {
        const communities = await CommunityService.findAll();
        return res.json(communities);
    }
    catch (error) {
        console.log(error);
        return res.json({ message: "Erro ao criar comunidade" });
    }
}

export async function getCommunityById(req: Request<Params>, res: Response){
    try {
        const { id } = req.params;
        const community = await CommunityService.findById(id);
        return res.json(community);
    } 
    catch (error) {
        console.log(error);
        return res.json({ message: "Erro ao buscar comunidade" });
    }
}

export async function updateCommunity(req: Request<Params>, res: Response){
    try {
        const { id } = req.params;
        const community = await CommunityService.update(id, req.body);
        return res.json(community);
    }
    catch (error) {
        console.log(error);
        return res.json({ message: "Erro ao atualizar comunidade" });
    }
}

export async function deleteCommunity(req: Request<Params>, res: Response){
    try {
        const { id } = req.params;
        await CommunityService.delete(id);
        return res.json({ message: "Comunidade deletada com sucesso" });
    }
    catch (error) {
        console.log(error);
        return res.json({ message: "Erro ao deletar comunidade" });
    }
}
