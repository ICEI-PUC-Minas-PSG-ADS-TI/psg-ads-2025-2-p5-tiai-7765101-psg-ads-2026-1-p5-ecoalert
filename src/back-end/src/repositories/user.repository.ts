import { prisma } from "@/config/database"
import { CreateUserDto } from "@/models/user.model"
import { parsePhone } from "@/utils/formatter";

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

  async findByCpf(cpf: string) {
    return prisma.user.findUnique({
      where: { cpf },
      include: { address: true }
    })
  }

  async findById(id: string) {
    const userEntity = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        cpf: true,
        phone: true,
        address: true,
      }
    })

    if (!userEntity) 
      return null

    const user = {...userEntity, phone: parsePhone(userEntity.phone), address: userEntity.address ?? undefined};

    return user;
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id }
    })
  }

  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        cpf: true,
        phone: true,
        address: true
      }
    })
  }
}