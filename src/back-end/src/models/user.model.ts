import { Address, Phone } from "@/types/shared"

export interface User {
  id: string
  name: string
  lastName: string
  email: string
  cpf: string
  phone: Phone
  password: string
  address?: Address
}

export interface CreateUserDto {
  name: string
  lastName: string
  email: string
  cpf: string
  phone: Phone
  password: string
  address?: Address
}