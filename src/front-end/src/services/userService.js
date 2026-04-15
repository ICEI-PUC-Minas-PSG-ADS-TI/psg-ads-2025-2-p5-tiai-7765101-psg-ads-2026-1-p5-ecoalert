import { api } from '@/api/api'
import { ApiError } from '@/types/Error';
import { AxiosError } from 'axios';

export async function createUser(user){
    try {
        user.phone = {
            ddd: '31',
            number: '999999999'
        }
        user.address.state = 'Minas Gerais'
        const response = await api.post("users", user);
        return response
    } catch (error) {
        if (error instanceof AxiosError && error.response.data) {
            throw new ApiError(error.response.data);
        }
        throw error;
    }
}

export async function login(user){
    const response = await api.post("/api/auth/login", user)
    return response.data
}
