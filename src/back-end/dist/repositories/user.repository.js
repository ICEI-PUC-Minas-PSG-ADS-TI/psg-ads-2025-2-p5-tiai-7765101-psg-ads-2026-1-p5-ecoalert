"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("@/config/database");
const formatter_1 = require("@/utils/formatter");
class UserRepository {
    async create(data) {
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
        return database_1.prisma.user.create({
            data: createData,
            include: {
                address: true
            }
        });
    }
    async findByEmail(email) {
        return database_1.prisma.user.findUnique({
            where: { email },
            include: { address: true }
        });
    }
    async findByCpf(cpf) {
        return database_1.prisma.user.findUnique({
            where: { cpf },
            include: { address: true }
        });
    }
    async findById(id) {
        const userEntity = await database_1.prisma.user.findUnique({
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
        });
        if (!userEntity)
            return null;
        const user = {
            ...userEntity,
            phone: (0, formatter_1.parsePhone)(userEntity.phone),
            address: userEntity.address ?? undefined
        };
        return user;
    }
    async delete(id) {
        return database_1.prisma.user.delete({
            where: { id }
        });
    }
    async findAll() {
        const users = await database_1.prisma.user.findMany({
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
        return users.map((user) => ({
            ...user,
            phone: (0, formatter_1.parsePhone)(user.phone),
            address: user.address ?? undefined
        }));
    }
}
exports.UserRepository = UserRepository;
