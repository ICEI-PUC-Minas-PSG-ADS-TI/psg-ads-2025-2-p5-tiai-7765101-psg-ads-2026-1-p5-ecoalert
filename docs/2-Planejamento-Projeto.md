# 2. Planejamento do Projeto

Esta parte mostra como o desenvolvimento do Nimbly foi organizado durante o semestre. A ideia principal foi trabalhar com entregas pequenas e contínuas, sempre conectando documentação, banco de dados, API e interface.

O projeto seguiu uma lógica ágil, com divisão por sprints. Em cada sprint, o grupo definiu tarefas, responsáveis, prazos e entregas esperadas. Assim, ficou mais fácil acompanhar o andamento do sistema e corrigir problemas ao longo do caminho.

---

## 2.1 Metodologia de Trabalho

A metodologia usada foi baseada em práticas ágeis, com foco em entregas por etapas. Em vez de deixar toda a implementação para o final, o grupo trabalhou em partes menores do sistema, chamadas de fatias verticais.

Uma fatia vertical representa uma funcionalidade completa, passando por todas as camadas do projeto:

**Banco de Dados → Back-end/API → Front-end/Tela**

Isso significa que uma tarefa só é considerada realmente pronta quando ela funciona de ponta a ponta. Por exemplo: se a funcionalidade envolve cadastro, ela precisa ter tela, validação, rota na API e gravação correta no banco de dados.

Essa forma de trabalho ajudou o grupo a testar o sistema aos poucos e evitar que cada integrante ficasse preso apenas a uma área específica. Todos participaram do desenvolvimento full-stack, mesmo que cada um tivesse uma responsabilidade principal de organização.

---

## 2.2 Organização das Sprints

O projeto foi dividido em quatro sprints. Cada sprint teve um objetivo principal e entregas específicas.

### Sprint 1 - Setup e visão inicial do produto

Na primeira sprint, o foco foi preparar a base do projeto. O grupo criou o repositório, organizou as pastas, definiu a ideia do produto e iniciou a estrutura técnica.

Principais entregas:

* Criação do repositório no GitHub;
* Estrutura inicial de pastas do projeto;
* Definição da proposta do Nimbly;
* Alinhamento com os ODS 11 e 13;
* Banco de dados inicial;
* Primeira tela conectada com a API.

### Sprint 2 - MVP e primeira funcionalidade completa

Na segunda sprint, o objetivo foi criar a primeira versão funcional do sistema. O grupo começou a transformar a ideia em uma aplicação real, com requisitos, banco de dados e uma funcionalidade completa.

Principais entregas:

* Documentação dos requisitos funcionais;
* Criação do script do banco de dados;
* Primeira funcionalidade integrada entre tela, API e banco;
* Salvamento de dados no banco;
* Revisão técnica das entregas.

### Sprint 3 - Funcionalidades principais e regras de negócio

Na terceira sprint, o desenvolvimento avançou para as funcionalidades centrais do Nimbly. O foco foi melhorar o monitoramento, aplicar regras de negócio e deixar o sistema mais próximo do uso real.

Principais entregas:

* Implementação de filtros;
* Uso de localização por GPS;
* Atualização do dashboard;
* Implementação do módulo de sensores;
* Validações no back-end;
* Atualização dos diagramas do projeto.

### Sprint 4 - Finalização, ajustes e entrega

Na quarta sprint, o foco foi finalizar o sistema, corrigir problemas, melhorar a documentação e preparar o projeto para apresentação.

Principais entregas:

* Correção de bugs;
* Filtragem e ordenação de sensores;
* Implementação do módulo de IA;
* Geração de relatório em PDF;
* Testes finais do sistema;
* Consolidação da documentação;
* Preparação para arguição e entrega final.

---

## 2.3 Papéis da Equipe

Todos os integrantes contribuíram com desenvolvimento, documentação e testes. Mesmo assim, alguns papéis foram definidos para facilitar a organização do grupo.

| Papel | Responsável | Função no projeto |
|------|-------------|-------------------|
| Tech Lead | Samuel | Organizar o repositório, apoiar decisões técnicas e acompanhar merges |
| Arquiteto de Dados | Vitor | Cuidar da modelagem, banco de dados e estrutura das informações |
| Gerente de Qualidade | Bruna | Revisar entregas, testar funcionalidades e apontar melhorias |
| Facilitador Ágil | Ricardo | Acompanhar prazos, tarefas, backlog e organização das sprints |

Esses papéis ajudaram na divisão de responsabilidades, mas não limitaram a atuação dos integrantes. Sempre que necessário, todos puderam colaborar em qualquer parte do sistema.

---

## 2.4 Controle das Atividades

Para acompanhar as tarefas, o grupo utilizou a lógica de Kanban. Cada atividade foi organizada de acordo com seu estado de desenvolvimento.

As colunas usadas foram:

* A Fazer;
* Desenvolver;
* Fila para Teste;
* Teste;
* Feito.

Cada cartão do Kanban representou uma tarefa ou funcionalidade do projeto. Sempre que possível, as tarefas foram escritas como entregas completas, seguindo a ideia de fatia vertical.

Cada atividade deveria conter:

* Responsável;
* Descrição da tarefa;
* Prazo;
* Status de andamento.

O controle também foi feito por meio dos commits no GitHub. Assim, foi possível acompanhar o que cada integrante desenvolveu e manter um histórico das alterações realizadas no projeto.

---

## 2.5 Acompanhamento das Sprints

### Sprint 1 - Setup

| Responsável | Papel | Tarefa | Início | Prazo | Status |
|-------------|-------|--------|--------|-------|--------|
| Ricardo | Facilitador Ágil | Preencher visão do produto, ODS e backlog no README | 10/03 | 12/03 | Concluído |
| Vitor | Arquiteto de Dados | Criar instância inicial do banco de dados | 11/03 | 12/03 | Concluído |
| Samuel | Tech Lead | Criar repositório e estruturar pastas | 10/03 | 11/03 | Concluído |
| Bruna | Gerente de Qualidade | Criar tela inicial conectada à API | 11/03 | 12/03 | Concluído |

### Sprint 2 - MVP

| Responsável | Papel | Tarefa | Início | Prazo | Status |
|-------------|-------|--------|--------|-------|--------|
| Vitor | Arquiteto de Dados | Gerar script do banco de dados | 06/04 | 08/04 | Concluído |
| Samuel | Tech Lead | Desenvolver primeira fatia vertical | 06/04 | 08/04 | Concluído |
| Ricardo | Facilitador Ágil | Documentar requisitos do MVP | 06/04 | 09/04 | Concluído |
| Bruna | Gerente de Qualidade | Realizar revisão técnica e merge | 06/04 | 09/04 | Concluído |

### Sprint 3 - Core do sistema

| Responsável | Papel | Tarefa | Início | Prazo | Status |
|-------------|-------|--------|--------|-------|--------|
| Vitor | Arquiteto de Dados | Implementar filtros | 28/04 | 10/05 | Concluído |
| Ricardo | Facilitador Ágil | Implementar localização por GPS | 28/04 | 10/05 | Concluído |
| Bruna | Gerente de Qualidade | Atualizar dashboard | 28/04 | 10/05 | Concluído |
| Samuel | Tech Lead | Implementar módulo de sensores | 05/05 | 10/05 | Concluído |

### Sprint 4 - Finalização

| Responsável | Papel | Tarefa | Início | Prazo | Status |
|-------------|-------|--------|--------|-------|--------|
| Vitor | Arquiteto de Dados | Implementar filtragem e ordenação de sensores e tela do relatorio de IA | 22/05 | 25/06 | Concluído |
| Bruna | Gerente de Qualidade | Implementar módulo de IA | 01/06 | 20/06 | Concluído |
| Ricardo | Facilitador Ágil | Gerar relatório em PDF | 10/06 | 25/06 | Concluído |
| Samuel | Tech Lead | Ajustar módulo de sensores | 15/06 | 25/06 | Concluído |
| Todos | Equipe | Preencher relatórios no APC | 25/06 | 26/06 | Em andamento |

---

## 2.6 Ferramentas Utilizadas no Planejamento

As principais ferramentas usadas para organizar o projeto foram:

* GitHub, para versionamento do código e acompanhamento dos commits;
* Kanban, para controle das tarefas de cada sprint;
* Markdown, para escrita da documentação;
* Reuniões do grupo, para alinhamento das prioridades e divisão das atividades;
* README e documentos da pasta `docs`, para registrar decisões e evolução do projeto.

---

## 2.7 Critérios para Considerar uma Tarefa Pronta

Uma tarefa foi considerada pronta quando:

* A funcionalidade estava implementada;
* O código estava salvo no repositório;
* A tela, a API e o banco estavam integrados quando necessário;
* A funcionalidade havia sido testada pelo grupo;
* A documentação relacionada estava atualizada.

Esse critério ajudou o grupo a manter o foco em entregas reais e funcionais, evitando tarefas incompletas ou apenas parcialmente implementadas.
