
# 3. Especificações do Projeto

📌 **Pré-requisito:** Planejamento do Projeto (Cronograma e Sprints definidos).

Nesta seção serão detalhados:

- ✅ Requisitos Funcionais  
- ✅ Histórias de Usuário  
- ✅ Requisitos Não Funcionais  
- ✅ Restrições do Projeto  

O objetivo é organizar claramente as funcionalidades, qualidades e limites da solução.

---

# 3.1 Requisitos Funcionais

Os **Requisitos Funcionais (RF)** descrevem o que o sistema deve fazer.

📌 Cada requisito deve:
- Representar uma funcionalidade única
- Ser claro e objetivo
- Orientar diretamente o desenvolvimento

---

## Tabela de Requisitos Funcionais

| ID    | Descrição do Requisito | Prioridade |
|-------|------------------------|------------|
| RF-01 | O sistema deve permitir o cadastro de novos usuários com nome, CPF, telefone e endereço completo. | 🔴 ALTA |
| RF-02 | O sistema deve permitir que o usuário faça login usando e-mail e senha. | 🔴 ALTA |
| RF-03 | O sistema deve ter um CRUD de comunidades de risco, salvando a localização e o nível de perigo. | 🔴 ALTA |
| RF-04 | O sistema deve diferenciar os tipos de usuário (comum e administrador), restringindo o acesso a certas funções. | 🔴 ALTA |

---

# 3.2 Histórias de Usuário

Cada história deve seguir o padrão ensinado na disciplina:

> **Como** [persona],  
> **eu quero** [funcionalidade],  
> **para que** [benefício].

⚠️ **ATENÇÃO:**  
Cada História de Usuário deve estar associada a um Requisito Funcional específico (RF-XX).

---

## Exemplos

**História 1 (relacionada ao RF-01):**  
Como usuário, quero registrar minhas tarefas para não esquecer de fazê-las.

**História 2 (relacionada ao RF-02):**  
Como administrador, quero alterar permissões para controlar o acesso ao sistema.

---

## Histórias do Projeto

---

### História 1 (relacionada ao RF-01 e RF-02)

**Como** morador de uma área de risco,

**Eu quero** criar uma conta e fazer login,

**Para que** eu possa acessar o sistema.

---

### História 2 (relacionada ao RF-03 e RF-04)

**Como** administrador (Defesa Civil),

**Eu quero** cadastrar e editar os dados das comunidades,

**Para que** eu consiga manter o mapa de risco atualizado no sistema.

---

### História 3 (relacionada ao RF-__)

Como __________________________________________  
Eu quero _______________________________________  
Para que _______________________________________

---

> 💡 Dica: Agrupe as histórias por módulo (Cadastro, Relatórios, Pagamentos, etc.) para melhor organização.

---

# 3.3 Requisitos Não Funcionais

Os **Requisitos Não Funcionais (RNF)** definem características de qualidade do sistema, como:

- ⚡ Desempenho  
- 🔒 Segurança  
- 🎨 Usabilidade  
- 📈 Escalabilidade  
- 🌐 Compatibilidade  

Eles garantem a qualidade da solução.

---

## Tabela de Requisitos Não Funcionais

| ID     | Descrição do Requisito | Prioridade |
|--------|------------------------|------------|
| RNF-01 | O sistema deve salvar as senhas no banco de forma criptografada usando bcrypt. | 🔴 ALTA |
| RNF-02 | A autenticação deve usar tokens JWT salvos em cookies HTTP-Only por segurança. | 🔴 ALTA |
| RNF-03 | O banco de dados utilizado será o PostgreSQL, gerenciado através do Prisma ORM. | 🔴 ALTA |
| RNF-04 | O front-end precisa ser responsivo e construído usando os componentes do Material UI (MUI). | 🟡 MÉDIA |

---

# 3.4 Restrições do Projeto

📌 **Restrições** são limitações externas impostas ao projeto.

Elas podem envolver:
- 📅 Prazo
- 🖥️ Tecnologia obrigatória ou proibida
- 🌐 Ambiente de execução
- 📜 Normas legais
- 🏢 Políticas institucionais

⚠️ Diferente dos RNFs, as restrições impõem **limites fixos** ao projeto.

---

## Tabela de Restrições

| ID  | Restrição |
|-----|-----------|
| R-01 | O projeto precisa ser entregue funcionando até o final do semestre letivo. |
| R-02 | A hospedagem da API e do banco de dados (Neon) deve usar apenas serviços com planos gratuitos, já que o grupo não tem orçamento. |
| R-03 | O front-end só pode usar a API desenvolvida pelo próprio grupo, sem depender de serviços prontos como o Firebase para o back-end. |
| R-04 | O tema do projeto precisa seguir o que foi proposto nas ODS 11 e ODS 13. |

---
## 3.5 Regras de Negócio

> Regras de Negócio definem as condições e políticas que o sistema deve seguir para garantir o correto funcionamento alinhado ao negócio.  
>  
> Elas indicam **quando** e **como** certas ações devem ocorrer, usando o padrão:  
>  
> **Se (condição) for verdadeira, então (ação) deve ser tomada.**  
>  
> Exemplo:  
> - "Um usuário só poderá finalizar um cadastro se todos os dados forem inseridos e validados com sucesso."  
>  
> Também pode ser escrito assim (if/then):  
> - "Se o usuário tem saldo acima de X, então a opção de empréstimo estará liberada."

---

 A tabela abaixo deve ser preenchida com as regras de negócio que **impactam seu projeto**. Os textos no quadro são apenas ilustrativos.

|ID    | Regra de Negócio                                                       |
|-------|-----------------------------------------------------------------------|
|RN-01 | O sistema não pode deixar cadastrar duas contas com o mesmo e-mail ou CPF.|
|RN-02 | Cada usuário só pode ter um único endereço cadastrado no perfil.          |
|RN-03 | Apenas usuários logados com perfil de administrador podem adicionar ou alterar os dados das comunidades.          |

💡 **Dica:** Explique sempre o motivo ou impacto da regra no sistema.

---
> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)
