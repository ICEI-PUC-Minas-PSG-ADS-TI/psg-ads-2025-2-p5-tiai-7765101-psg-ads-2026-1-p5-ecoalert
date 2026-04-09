# Banco de Dados - Nimbly

## Criar banco de dados

```sql
CREATE DATABASE "Nimbly-database";
```

---

## Estrutura do banco de dados

A estrutura abaixo representa o banco de dados atual do sistema.

Para a Sprint 2, a funcionalidade implementada (cadastro e autenticação de usuários) utiliza diretamente as tabelas `User` e `Address`.  
As demais estruturas fazem parte da evolução do sistema e já estão presentes no banco.

---

## Criar enum de perfil de usuário

```sql
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');
```

---

## Criar tabela de usuários

```sql
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
```

---

## Criar tabela de endereços

```sql
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

ALTER TABLE "Address"
ADD CONSTRAINT "Address_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
```

---

## Criar tabela de comunidades

```sql
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "riskLevel" TEXT NOT NULL,
    "population" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);
```

---


## Criar tabela sensors

```sql
CREATE TABLE sensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(100) NOT NULL,
    description TEXT,

    type VARCHAR(50) NOT NULL,

    status VARCHAR(20) DEFAULT 'ACTIVE',

    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,

    location GEOGRAPHY(Point, 4326),

    metadata JSONB,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
## Observações

- A tabela `User` armazena os dados principais do usuário, incluindo autenticação e controle de perfil.
- A tabela `Address` possui relação 1:1 com `User`, garantindo que cada usuário tenha apenas um endereço.
- A tabela `Community` representa regiões monitoradas pelo sistema, sendo parte inicial do domínio da aplicação.
- O campo `role` permite controle de acesso (ADMIN ou USER).
- Os índices `UNIQUE` garantem integridade para email, CPF e vínculo de endereço.

---

## Buscar usuário por ID

```sql
SELECT *
FROM "User"
WHERE "id" = '123';
```
