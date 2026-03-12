import { api } from '../api/api'

export async function createUser(user){
    const response = await api.post("/api/users", user)
    return response.data
}

export async function login(user){
    const response = await api.post("/api/users/login", user)
    return response.data
}