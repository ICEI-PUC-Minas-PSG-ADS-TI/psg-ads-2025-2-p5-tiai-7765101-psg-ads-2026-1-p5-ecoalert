import { CreateCommunityDto, Community } from "@/models/community.model";
import { CommunityRepository } from "@/repositories/community.repository";
import { AppError } from "@/types/error";

const repository = new CommunityRepository();

export class CommunityService{
    static async create(data: CreateCommunityDto): Promise<Community> {
        const errorFields: Record<string, string> = {};

        const communityByName = await repository.findByName(data.name);
    
        if(communityByName) {
            errorFields.id = "Já existe uma comunidade cadastrada com esse nome";
        }
        const comunidadeExists = Object.keys(errorFields).length > 0;

        if (comunidadeExists) {
            throw new AppError("Comunidade já cadastrada",400,"Community already exists",errorFields);
        }

        const createdCommunity = await repository.create(data);

        return createdCommunity;
    }

    static async findAll() {
        return repository.findAll();
    }

    static async findById(id: string) {
        const community = await repository.findById(id);

        if (!community) {
            throw new AppError(
                "Comunidade não encontrada",404,"Community not found");
        }
        
        return community;
    }

    static async update(id: string, data: Partial<CreateCommunityDto>) {
        const community = await repository.findById(id);

        if (!community) {
            throw new AppError("Comunidade não encontrada",404,"Community not found");
        }

        return repository.update(id, data);
    }

    static async delete(id: string){
        const community = await repository.findById(id);

        if (!community) {
            throw new AppError("Comunidade não encontrada",404,"Community not found");
        }

        return repository.delete(id);
    
    }
}