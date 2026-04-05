import { CreateUserDto, User } from "@/models/user.model";
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

    static async findByEmail(email: string) {
        return repository.findByEmail(email);
    }

    static async findAll() {
        return repository.findAll();
    }

    static async findById(id: string) {
        const user = await repository.findById(id);

        if (!user) {
            throw new AppError("Usuário não encontrado", 404, "User not found");
        }

        return user;
    }
}

