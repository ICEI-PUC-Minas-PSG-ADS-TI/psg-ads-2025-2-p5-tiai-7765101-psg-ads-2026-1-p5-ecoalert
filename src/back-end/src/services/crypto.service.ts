import bcrypt from 'bcrypt';

export class CryptoService {
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}