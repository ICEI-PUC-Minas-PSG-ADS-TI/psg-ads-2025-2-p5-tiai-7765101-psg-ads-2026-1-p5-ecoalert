# Banco de Dados - Nimbly

Este diretório contém a documentação e o script de modelagem física do banco de dados (PostgreSQL) utilizado no projeto. O arquivo consolidado para execução encontra-se em [`schema.sql`](./schema.sql).

## 📌 Escopo da Sprint 2
A estrutura abaixo representa o banco de dados atual, com foco nas funcionalidades implementadas de ponta a ponta nesta Sprint (Cadastro, Autenticação e Gestão de Comunidades). 

---

## Estrutura do Banco (DDL)

### 1. Enum de Perfil de Usuário
```sql
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');
```

### 2. Tabela de Usuários
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

### 3. Tabela de Endereços (Relacionamento 1:1)
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

### 4. Tabela de Comunidades
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

## 🏗️ Observações Arquiteturais
* **User:** Armazena os dados principais, incluindo credenciais de autenticação (senhas hasheadas) e o nível de acesso ao sistema (`role`).
* **Address:** Possui relação estrita de 1:1 com `User`, garantindo que cada conta tenha apenas um endereço geográfico válido associado.
* **Community:** Representa as regiões e áreas de risco monitoradas, formando o domínio principal para os alertas de desastres.
* **Integridade:** Os índices `UNIQUE` no banco garantem que não ocorram cadastros com CPFs e e-mails duplicados.
