import { prisma } from "@/config/database"
import {
  CreateUserDto,
  UserEntity,
  UserEntityWithoutPassword,
  UserWithoutPassword
} from "@/models/user.model"
import { parsePhone } from "@/utils/formatter";

export class UserRepository {

  async create(data: CreateUserDto): Promise<UserEntity> {
    const formattedPhone = `${data.phone.ddd}${data.phone.number}`;

    const addressData = data.address ? {
      cep: data.address.cep,
      street: data.address.street,
      neighborhood: data.address.neighborhood,
      city: data.address.city,
      ...(data.address.state && { state: data.address.state }),
      number: data.address.number
    } : null;

    const createData = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      cpf: data.cpf,
      phone: formattedPhone,
      password: data.password,
      role: data.role ?? "USER",
      address: addressData
        ? {
            create: addressData
          }
        : undefined
    };

    return prisma.user.create({
      data: createData as any,
      include: {
        address: true
      }
    }) as Promise<UserEntity>;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { address: true }
    })
  }

  async findByCpf(cpf: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { cpf },
      include: { address: true }
    })
  }

  async findById(id: string): Promise<UserWithoutPassword | null> {
    const userEntity = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        cpf: true,
        phone: true,
        role: true,
        address: true,
      }
    })

    if (!userEntity) 
      return null

    const user = {
      ...userEntity,
      phone: parsePhone(userEntity.phone),
      address: userEntity.address ?? undefined
    };

    return user;
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id }
    })
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        cpf: true,
        phone: true,
        role: true,
        address: true
      }
    })

    return users.map((user: any) => ({
      ...user,
      phone: parsePhone(user.phone),
      address: user.address ?? undefined
    }))
  }
}
