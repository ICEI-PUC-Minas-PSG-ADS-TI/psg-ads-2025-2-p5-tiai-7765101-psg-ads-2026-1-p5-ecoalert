"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("@/repositories/user.repository");
const crypto_service_1 = require("./crypto.service");
const error_1 = require("@/types/error");
const repository = new user_repository_1.UserRepository();
class UserService {
    static async create(data) {
        const errorFields = {};
        const userByEmail = await repository.findByEmail(data.email);
        if (userByEmail) {
            errorFields.email = "Já existe um usuário cadastrado com este e-mail";
        }
        const userByCpf = await repository.findByCpf(data.cpf);
        if (userByCpf) {
            errorFields.cpf = "Já existe um usuário cadastrado com este CPF";
        }
        const userExists = Object.keys(errorFields).length > 0;
        if (userExists) {
            throw new error_1.AppError("Usuário já cadastrado", 400, "User already exists", errorFields);
        }
        const hashedPassword = await crypto_service_1.CryptoService.hashPassword(data.password);
        data.password = hashedPassword;
        const createdUser = await repository.create(data);
        const { password, phone, address, ...restOfUser } = createdUser;
        const formattedPhone = {
            ddd: phone.substring(0, 2),
            number: phone.substring(2)
        };
        return {
            ...restOfUser,
            phone: formattedPhone,
            address: address || undefined
        };
    }
    static async findByEmail(email) {
        return repository.findByEmail(email);
    }
    static async findAll() {
        return repository.findAll();
    }
    static async findById(id) {
        const user = await repository.findById(id);
        if (!user) {
            throw new error_1.AppError("Usuário não encontrado", 404, "User not found");
        }
        return user;
    }
}
exports.UserService = UserService;
