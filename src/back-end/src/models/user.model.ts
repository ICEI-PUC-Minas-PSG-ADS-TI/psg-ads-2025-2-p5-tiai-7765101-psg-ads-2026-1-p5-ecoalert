import { Address, Phone } from "@/types/shared"

export type UserRole = "ADMIN" | "USER"

export interface UserEntity {
  id: string
  name: string
  lastName: string
  email: string
  cpf: string
  phone: string
  password: string
  role: UserRole
  address: Address | null
}

export interface UserEntityWithoutPassword
  extends Omit<UserEntity, "password"> {}

export interface UserWithoutPassword extends Omit<User, "password"> {}

export interface User {
  id: string
  name: string
  lastName: string
  email: string
  cpf: string
  phone: Phone
  password: string
  role: UserRole
  address?: Address
}

export interface CreateUserDto {
  name: string
  lastName: string
  email: string
  cpf: string
  phone: Phone
  password: string
  role?: UserRole
  address?: Address
}
