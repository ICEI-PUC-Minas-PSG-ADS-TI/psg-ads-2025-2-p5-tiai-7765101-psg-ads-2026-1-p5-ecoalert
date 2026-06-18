import { api } from '@/api/api'
import { routes } from '@/constants/api-routes';
import { ApiError } from '@/types/Error';
import { AxiosError } from 'axios';

export async function createUser(user){
    try {
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

export async function updateLoggedUser(user){
    try {
        const response = await api.patch(routes.users.me, user);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response.data) {
            throw new ApiError(error.response.data);
        }
        throw error;
    }
}
