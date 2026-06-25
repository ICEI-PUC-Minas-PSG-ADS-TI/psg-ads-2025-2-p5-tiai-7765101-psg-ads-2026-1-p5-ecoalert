# Nimbly

`CURSO`: Análise e Desenvolvimento de Sistemas

`DISCIPLINA`: Trabalho Interdisciplinar: Aplicações Inovadoras

`SEMESTRE`: 5° Semestre

O Nimbly é uma plataforma digital para monitorar chuvas intensas e prevenir desastres em áreas vulneráveis. O sistema centraliza dados climáticos e mapas em um único painel, permitindo que autoridades e moradores acompanhem o risco de enchentes em tempo real e recebam alertas rápidos para evacuação.

ODS Alinhados:

ODS 11: Cidades e Comunidades Sustentáveis.

ODS 13: Ação Contra a Mudança Global do Clima.

## Integrantes

* Bruna Luiza Siqueira Borges Matias
* Ricardo Araújo Maciel (ricardoamaciel2016@gmail.com)
* Samuel Maia de Oliveira
* Vitor Fortunato Silva

## Orientador

* Juliana Padilha

## Instruções de utilização

### Pré-requisitos

Antes de executar o projeto, tenha instalado:

* Node.js
* npm
* Banco de dados PostgreSQL ou uma URL de conexão compatível com Prisma

### Configuração do back-end

1. Acesse a pasta do back-end:

```bash
cd src/back-end
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na pasta `src/back-end` com as variáveis necessárias:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
JWT_SECRET="sua_chave_jwt"
JWT_REFRESH_SECRET="sua_chave_refresh"
OPEN_METEO_FORECAST_BASE_URL=https://api.open-meteo.com/v1
OPEN_METEO_ARCHIVE_BASE_URL=https://archive-api.open-meteo.com/v1
GEMINI_API_KEY="sua_chave_gemini"
```

4. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

5. Inicie a API:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

### Configuração do front-end

1. Em outro terminal, acesse a pasta do front-end:

```bash
cd src/front-end
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na pasta `src/front-end` com a URL da API:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Inicie a aplicação:

```bash
npm run dev
```

O front-end ficará disponível em `http://localhost:5173`.

# Documentação

<ol>
<li><a href="docs/1-Contexto.md"> Documentação de Contexto</a></li>
<li><a href="docs/2-Planejamento-Projeto.md"> Planejamento do Projeto</a></li>
<li><a href="docs/3-Especificação.md"> Especificação do Projeto</a></li>
<li><a href="docs/4-Projeto-Solucao.md"> Projeto da solução</a></li>
<li><a href="docs/5-Interface-Sistema.md"> Interface do Sistema</a></li>
<li><a href="docs/6-Conclusão.md"> Conclusão</a></li>
<li><a href="docs/7-Referências.md"> Referências</a></li>
</ol>

# Código

<li><a href="src/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="docs/apresentacao/README.md"> Apresentação da solução</a></li>


## Histórico de versões

* 0.1.1
    * CHANGE: Atualização das documentações. Código permaneceu inalterado.
* 0.1.0
    * Implementação da funcionalidade X pertencente ao processo P.
* 0.0.1
    * Trabalhando na modelagem do processo de negócio.

