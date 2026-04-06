import { prisma } from "@/config/database"
import { CreateCommunityDto } from "@/models/community.model"

export class CommunityRepository {

  async create(data: CreateCommunityDto) {
    return prisma.community.create({
      data
    })
  }

  async findAll() {
    return prisma.community.findMany()
  }

  async findById(id: string) {
    return prisma.community.findUnique({
      where: { id }
    })
  }

  async findByName(name: string) {
    return prisma.community.findFirst({
      where: { name }
    })
  }

  async update(id: string, data: Partial<CreateCommunityDto>) {
    return prisma.community.update({
      where: { id },
      data
    })
  }

  async delete(id: string) {
    return prisma.community.delete({
      where: { id }
    })
  }
}