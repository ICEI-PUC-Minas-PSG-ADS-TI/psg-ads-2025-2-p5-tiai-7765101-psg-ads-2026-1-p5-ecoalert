import { Contract } from "./Contract";
import { Order } from "./Order";
import { Address } from "./ValueObjects";

type Phone = {
  ddd: string;
  number: string;
}

export type LoggedUser = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  cpf: string;
  logo: string;
};

export type DashboardSummary = {
  activeRentals: number;
  monthlyRevenue: number;
  costumersCount: number;
  openContracts: number;
  lastOrders: Order[];
  lastContracts: Contract[];
}

export type CreateUser = {
  name: string;
  lastName: string;
  email: string;
  cpf: string;
  password: string;
  phone: Phone;

  address: {
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    number: string;
  };
  logo?: string;
}
