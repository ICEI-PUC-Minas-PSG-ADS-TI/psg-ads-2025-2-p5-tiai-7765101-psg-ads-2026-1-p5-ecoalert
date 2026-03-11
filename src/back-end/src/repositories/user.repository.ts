import { prisma } from "@/config/database"
import { CreateUserDto } from "@/models/user.model"

export class UserRepository {

  async create(data: CreateUserDto) {
    const formattedPhone = `${data.phone.ddd}${data.phone.number}`;

    return prisma.user.create({
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        cpf: data.cpf,
        phone: formattedPhone,
        password: data.password,
        address: data.address
          ? {
              create: data.address
            }
          : undefined
      },
      include: {
        address: true
      }
    })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { address: true }
    })
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { address: true }
    })
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id }
    })
  }
}