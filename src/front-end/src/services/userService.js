import { api } from '../api/api'

export async function createUser(user){
    const response = await api.post("/api/users", user)
    return response.data
}