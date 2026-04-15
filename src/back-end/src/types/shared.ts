export interface Address {
  cep: string
  street: string
  neighborhood: string
  city: string
  state?: string | null
  number: string
}

export interface Phone {
  ddd: string
  number: string
}