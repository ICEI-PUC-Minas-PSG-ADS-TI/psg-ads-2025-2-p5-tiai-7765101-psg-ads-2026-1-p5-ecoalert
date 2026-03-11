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
}

