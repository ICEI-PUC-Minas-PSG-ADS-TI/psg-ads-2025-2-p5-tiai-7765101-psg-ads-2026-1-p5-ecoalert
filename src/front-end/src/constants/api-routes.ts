export const routes = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
  },
  users: {
    list: "/users",
    create: "/users/create", 
    get: "/users",       
    products: "/users/products",
    costumers: "/users/costumers",
    orders: "/users/orders",
    contracts: "/users/contracts",
    rents: "/users/rents",
  },
  dashboard: {
    summary: "/dashboard/summary",
  },
  product: {
    get: "/products",
    delete: "/products",
    update: "/products",
  },
  costumers: {
    create: "/costumers/create",
    getById: (id: string) => `/costumers/${id}`,
  },
  contract: {
    generate: "/contracts/generate",
    download: "/contracts/download",
    sign: "/contracts/sign",
  },
  receipt: {
    generate: "/receipts/generate",
  },
  orders: {
    updateStatus: "/orders/status",
  },
  clauses: {
    getAllByUser: "/clauses",
  },
  rents: {
    list: "/rents",
    getById: (id: string) => `/rents/${id}`,
    update: (id: string) => `/rents/${id}`,
    delete: (id: string) => `/rents/${id}`,
    updateStatus: (id: string) => `/rents/status/${id}`,
  },
}
