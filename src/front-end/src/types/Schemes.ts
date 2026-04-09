import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),

  lastName: z.string().min(1, "Sobrenome é obrigatório"),

  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),

  cpf: z
    .string()
    .min(11, "CPF incompleto")
    .max(11, "CPF inválido"),

  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .refine(value => /[a-z]/.test(value), {
      message: "Senha deve conter ao menos uma letra minúscula",
    })
    .refine(value => /[A-Z]/.test(value), {
      message: "Senha deve conter ao menos uma letra maiúscula",
    })
    .refine(value => /\d/.test(value), {
      message: "Senha deve conter ao menos um número",
    }),

  address: z.object({
    cep: z
      .string()
      .min(8, "CEP incompleto")
      .max(8, "CEP inválido"),

    street: z.string().min(1, "Rua é obrigatória"),

    neighborhood: z.string().min(1, "Bairro é obrigatório"),

    city: z.string().min(1, "Cidade é obrigatória"),

    number: z.string().min(1, "Número é obrigatório"),
  }),

  socialName: z.string().min(1, "Nome social é obrigatório"),

  instagram: z
    .string()
    .min(1, "Instagram é obrigatório"),

  logo: z.string().url().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),

  price: z
    .string()
    .regex(/^\d+$/, "Preço inválido"),

  stock: z.coerce
    .number()
    .int("Estoque deve ser um número inteiro")
    .positive("Estoque deve ser um número positivo"),

  imageUri: z.string().url().optional()
});

export const createCostumerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),

  lastName: z.string().min(1, "Sobrenome é obrigatório"),

  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),

  cpf: z
    .string()
    .min(11, "CPF incompleto")
    .max(11, "CPF inválido"),

  address: z.object({
    cep: z
      .string()
      .min(8, "CEP incompleto")
      .max(8, "CEP inválido"),

    street: z.string().min(1, "Rua é obrigatória"),

    neighborhood: z.string().min(1, "Bairro é obrigatório"),

    city: z.string().min(1, "Cidade é obrigatória"),

    number: z.string().min(1, "Número é obrigatório"),
  })
});

export const creasteOrderSchema = z.object({
  costumerId: z.string().min(1, "Selecione o cliente do pedido"),
  deliveryDate: z
    .string()
    .min(8, "Informe a data completa (DD/MM/AAAA)")
    .max(8, "Data inválida")
    .refine((val) => {
      const day = parseInt(val.substring(0, 2));
      const month = parseInt(val.substring(2, 4));
      return day >= 1 && day <= 31 && month >= 1 && month <= 12;
    }, "Data de entrega inválida").optional(),
  products: z.array(z.object({
    productId: z.string().min(1, "Selecione ao menos 1 produto"),
    quantity: z.coerce
      .number()
      .int("Quantidade deve ser um número inteiro")
      .positive("Quantidade deve ser um número positivo"),
  })),
  deliveryTax: z.coerce.number().min(0).optional(),
  address: z.object({
    cep: z.string().min(8, "CEP inválido"),
    street: z.string().min(1, "Rua é obrigatória"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
  }).optional()
});

export const createRentSchema = z.object({
  costumerId: z.string().min(1, "Selecione o cliente do aluguel"),
  deliveryType: z.enum(["delivery", "pickup"]),
  deliveryDate: z
    .string()
    .min(8, "Informe a data completa (DD/MM/AAAA)")
    .max(8, "Data inválida")
    .refine((val) => {
      const day = parseInt(val.substring(0, 2));
      const month = parseInt(val.substring(2, 4));
      return day >= 1 && day <= 31 && month >= 1 && month <= 12;
    }, "Data inválida"),
  returnDate: z
    .string()
    .min(8, "Informe a data completa (DD/MM/AAAA)")
    .max(8, "Data inválida")
    .refine((val) => {
      const day = parseInt(val.substring(0, 2));
      const month = parseInt(val.substring(2, 4));
      return day >= 1 && day <= 31 && month >= 1 && month <= 12;
    }, "Data inválida"),
  products: z.array(z.object({
    productId: z.string().min(1, "Selecione ao menos 1 produto"),
    quantity: z.coerce
      .number()
      .int("Quantidade deve ser um número inteiro")
      .positive("Quantidade deve ser um número positivo"),
  })),
  deliveryTax: z.coerce.number().min(0).optional(),
  address: z.object({
    cep: z.string().min(8, "CEP inválido"),
    street: z.string().min(1, "Rua é obrigatória"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
  }).optional(),
}).superRefine((data, ctx) => {
  if (data.deliveryType === "delivery" && !data.address) {
    ctx.addIssue({
      code: "custom",
      message: "Informe o endereço para entrega",
      path: ["address"],
    });
  }
});

export const updateProductSchema = productSchema.partial();

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type CreateCostumerFormData = z.infer<typeof createCostumerSchema>;
export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormOutput = z.output<typeof productSchema>;
export type UpdateProductFormInput = z.input<typeof updateProductSchema>;
export type UpdateProductFormOutput = z.output<typeof updateProductSchema>;
export type CreateOrderFormInput = z.input<typeof creasteOrderSchema>;
export type CreateOrderFormData = z.output<typeof creasteOrderSchema>;
export type CreateRentFormInput = z.input<typeof createRentSchema>;
export type CreateRentFormData = z.output<typeof createRentSchema>;
