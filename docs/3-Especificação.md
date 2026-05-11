
# 3. Especificações do Projeto


---

# 3.1 Requisitos Funcionais

---

## Tabela de Requisitos Funcionais

| ID    | Descrição do Requisito | Prioridade |
|-------|------------------------|------------|
| **RF-01** | O sistema deve permitir o cadastro de novos usuários com dados pessoais (nome, CPF, telefone) e endereço completo. | 🔴 ALTA |
| **RF-02** | O sistema deve autenticar usuários utilizando e-mail e senha, gerando tokens de acesso (Access e Refresh Tokens). |🔴 ALTA |
| **RF-03** | O sistema deve permitir que usuários encerrem a sessão (logout), invalidando os tokens de acesso. | 🔴 ALTA |
| **RF-04** | O sistema deve permitir a consulta do perfil do usuário logado e a listagem de usuários do sistema. | 🟡 MÉDIA |
| **RF-05** | O sistema deve permitir a listagem e visualização de detalhes de comunidades monitoradas. | 🔴 ALTA |
| **RF-06** | O sistema deve permitir o cadastro, edição e exclusão de comunidades, restrito a usuários com perfil de Administrador (ADMIN). |🔴 ALTA |
| **RF-07** | O sistema deve consultar e exibir dados climáticos (previsão e histórico) através de integração com API meteorológica. |🔴 ALTA |
| **RF-08** | O sistema deve exibir um painel (dashboard) com gráficos de temperatura, precipitação e vento por período (6h, 12h, 24h, 7d). |🔴 ALTA |

---

# 3.2 Histórias de Usuário


## Histórias do Projeto

---

### História 1 (relacionada ao RF-01)
**Como** morador de uma área de vulnerabilidade climática,  
**Eu quero** criar uma conta informando meus dados pessoais e endereço,  
**Para que** eu possa me registrar na plataforma de monitoramento.  

### História 2 (relacionada ao RF-02)
**Como** usuário cadastrado,  
**Eu quero** fazer login com meu e-mail e senha,  
**Para que** eu consiga acessar meu painel de forma segura e protegida.  

### História 3 (relacionada ao RF-07 e RF-08)
**Como** usuário logado,  
**Eu quero** visualizar os gráficos de chuva, vento e temperatura da minha região,  
**Para que** eu consiga monitorar as condições atuais e identificar possíveis níveis de alerta.  

### História 4 (relacionada ao RF-06)
**Como** administrador do sistema (Defesa Civil),  
**Eu quero** cadastrar, editar e remover os dados de comunidades em risco,  
**Para que** eu consiga manter o mapa de locais monitorados sempre atualizado na base de dados.

---

# 3.3 Requisitos Não Funcionais

---

## Tabela de Requisitos Não Funcionais

| ID     | Descrição do Requisito | Prioridade |
|--------|------------------------|------------|
| **RNF-01** | O back-end deve ser desenvolvido em Node.js com TypeScript e framework Express. |🔴 ALTA |
| **RNF-02** | O front-end deve ser desenvolvido em React (Vite) com roteamento protegido e componentes do Material UI (MUI). |🔴 ALTA |
| **RNF-03** | O sistema deve utilizar banco de dados relacional PostgreSQL, manipulado via Prisma ORM. |🔴 ALTA |
| **RNF-04** | A comunicação entre cliente e servidor deve ser feita via API RESTful retornando formato JSON. |🔴 ALTA |
| **RNF-05** | A autenticação deve ser gerida via JWT (JSON Web Tokens) com senhas criptografadas em bcrypt. |🔴 ALTA |
| **RNF-06** | O sistema deve atualizar os dados de leitura climática na interface automaticamente a cada 1 hora. |🟡 MÉDIA |

---

# 3.4 Restrições do Projeto


## Tabela de Restrições

| ID    | Restrição |
|-------|-----------|
| **R-01** | O projeto precisa ser entregue funcionando até o final do semestre letivo. |
| **R-02** | A hospedagem da API e do banco de dados (Neon) deve usar apenas serviços com planos gratuitos, já que o grupo não tem orçamento. |
| **R-03** | O front-end só pode usar a API desenvolvida pelo próprio grupo, sem depender de serviços prontos (BaaS) como o Firebase para o back-end. |
| **R-04** | O tema do projeto precisa estar estritamente alinhado com o que foi proposto nas diretrizes globais ODS 11 e ODS 13. |

---
## 3.5 Regras de Negócio


|ID    | Regra de Negócio                                                       |
|-------|-----------------------------------------------------------------------|
| **RN-01** |  O sistema não deve permitir o cadastro de um novo usuário se o CPF ou E-mail informado já existir no banco de dados. |
| **RN-02** |  Operações de escrita, edição e deleção de Comunidades só podem ser executadas por usuários cujo atributo `role` seja `ADMIN`. |
| **RN-03** |  O sistema deve bloquear a criação de uma comunidade caso já exista outra cadastrada com o mesmo nome na base. |
| **RN-04** |  O status de alerta é calculado dinamicamente. Risco "Alto" ocorre se a precipitação total for >= 15mm OU rajada de vento máxima for >= 60km/h. Risco de "Atenção" ocorre se precipitação for >= 5mm OU rajada de vento >= 40km/h. Valores inferiores geram status "Sem risco". |
| **RN-05** |  A consulta meteorológica no back-end exige a validação prévia obrigatória de latitude e longitude numéricas antes de realizar o proxy para a API externa. |
