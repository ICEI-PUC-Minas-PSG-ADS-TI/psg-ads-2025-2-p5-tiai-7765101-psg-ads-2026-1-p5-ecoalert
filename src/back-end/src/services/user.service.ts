import { CreateUserDto, User } from "@/models/user.model";
import { UserRepository } from "@/repositories/user.repository";

const repository = new UserRepository();

export class UserService {
    async create(data: CreateUserDto): Promise<Omit<User, "password">> {
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

    async login(email: string, password: string) {

        console.log(email)

        const user = await repository.findByEmail(email);

        console.log('usuário encontrado', user)
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        if (user.password !== password) {
            throw new Error('Senha incorreta');
        }

        console.log('Login bem sucedido', user)
    }
}

