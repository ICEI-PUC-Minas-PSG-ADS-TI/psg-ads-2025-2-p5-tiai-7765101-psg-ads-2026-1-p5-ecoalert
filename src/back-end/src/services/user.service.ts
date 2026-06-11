import {
    CreateUserDto,
    UpdateUserDto,
    User,
    UserEntity,
    UserWithoutPassword
} from "@/models/user.model";
import { UserRepository } from "@/repositories/user.repository";
import { CryptoService } from "./crypto.service";
import { AppError } from "@/types/error";

const repository = new UserRepository();

export class UserService {
    static async create(data: CreateUserDto): Promise<Omit<User, "password">> {
        const errorFields: Record<string, string> = {};

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
            throw new AppError("Usuário já cadastrado", 400, "User already exists", errorFields);
        }

        const hashedPassword = await CryptoService.hashPassword(data.password);

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

    static async findByEmail(email: string): Promise<UserEntity | null> {
        return repository.findByEmail(email);
    }

    static async findAll(): Promise<UserWithoutPassword[]> {
        return repository.findAll();
    }

    static async findById(id: string): Promise<UserWithoutPassword> {
        const user = await repository.findById(id);

        if (!user) {
            throw new AppError("Usuário não encontrado", 404, "User not found");
        }

        return user;
    }

    static async update(id: string, data: UpdateUserDto): Promise<UserWithoutPassword> {
        const user = await repository.findEntityById(id);

        if (!user) {
            throw new AppError("Usuário não encontrado", 404, "User not found");
        }

        if (!data.currentPassword) {
            throw new AppError("Senha atual obrigatória", 400, "Current password required", {
                currentPassword: "Informe sua senha atual para confirmar a edição"
            });
        }

        const passwordMatches = await CryptoService.verifyPassword(data.currentPassword, user.password);

        if (!passwordMatches) {
            throw new AppError("Senha atual inválida", 401, "Invalid current password", {
                currentPassword: "Senha atual inválida"
            });
        }

        const errorFields: Record<string, string> = {};

        if (data.email && data.email !== user.email) {
            const userByEmail = await repository.findByEmail(data.email);

            if (userByEmail && userByEmail.id !== id) {
                errorFields.email = "Já existe um usuário cadastrado com este e-mail";
            }
        }

        if (data.cpf && data.cpf !== user.cpf) {
            const userByCpf = await repository.findByCpf(data.cpf);

            if (userByCpf && userByCpf.id !== id) {
                errorFields.cpf = "Já existe um usuário cadastrado com este CPF";
            }
        }

        if (Object.keys(errorFields).length > 0) {
            throw new AppError("Dados já cadastrados", 400, "User already exists", errorFields);
        }

        const { currentPassword, ...updateData } = data;

        return repository.update(id, updateData);
    }
}
