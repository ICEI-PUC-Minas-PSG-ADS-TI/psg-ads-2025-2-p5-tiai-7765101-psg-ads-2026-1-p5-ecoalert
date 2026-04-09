import { AppError } from "@/types/error";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";
import { ErrorMessages } from "@/utils/constants";
import { CryptoService } from "./crypto.service";
import { User } from "@/models/user.model";
import { parsePhone } from "@/utils/formatter";

interface LoginResponse {
    token: string;
    user: Omit<User, "password">;
    refreshToken: string;
}

export class AuthService {
    static async login(email: string, password: string): Promise<LoginResponse> {
        const user = await UserService.findByEmail(email);

        if (!user) {
            throw new AppError("Credenciais invalidas", 401, ErrorMessages.InvalidCredentials);
        }

        const passwordMatches = await CryptoService.verifyPassword(password, user.password);

        if (passwordMatches) {
            return {
                token: TokenService.generateAccessToken({
                    userId: user.id,
                    email: user.email,
                    role: user.role
                }),
                refreshToken: TokenService.generateRefreshToken({
                    userId: user.id,
                    email: user.email,
                    role: user.role
                }),
                user: {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    cpf: user.cpf,
                    phone: parsePhone(user.phone),
                    role: user.role,
                    address: user.address ?? undefined
                }
            };
        }

        throw new AppError("Credenciais invalidas", 401, ErrorMessages.InvalidCredentials);
    }
}
