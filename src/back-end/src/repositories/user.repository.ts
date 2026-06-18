import { prisma } from "@/config/database"
import {
  CreateUserDto,
  UpdateUserDto,
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
      state: data.address.state ?? null,
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

  async findEntityById(id: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { address: true }
    }) as Promise<UserEntity | null>
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

  async update(id: string, data: Omit<UpdateUserDto, "currentPassword">): Promise<UserWithoutPassword> {
    const formattedPhone = data.phone
      ? `${data.phone.ddd}${data.phone.number}`
      : undefined;

    const addressData = data.address
      ? {
          cep: data.address.cep,
          street: data.address.street,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state ?? null,
          number: data.address.number
        }
      : undefined;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.email && { email: data.email }),
        ...(data.cpf && { cpf: data.cpf }),
        ...(formattedPhone && { phone: formattedPhone }),
        ...(addressData && {
          address: {
            upsert: {
              create: addressData,
              update: addressData
            }
          }
        })
      },
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
    });

    return {
      ...updatedUser,
      phone: parsePhone(updatedUser.phone),
      address: updatedUser.address ?? undefined
    };
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
