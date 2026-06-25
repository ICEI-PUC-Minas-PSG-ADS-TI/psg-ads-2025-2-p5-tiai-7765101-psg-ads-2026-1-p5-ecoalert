# 5. Interface do Sistema

Esta seção apresenta o portfólio visual do Nimbly, registrando as telas reais implementadas na aplicação web ao longo das sprints. As capturas representam o sistema codificado e em execução, com foco nas funcionalidades entregues em cada etapa.

---

## 5.1. Galeria de Telas (Por Sprint)

### Sprint 1: Tela Inicial e Navegação Pública

**Funcionalidade:** Apresentação inicial da aplicação, identidade visual do Nimbly e acesso às rotas públicas de cadastro e login.

**Descrição:** A primeira versão da interface definiu a estrutura visual do sistema, com cabeçalho, navegação pública, alternância de tema e botões de entrada/cadastro. Essa estrutura aparece nas telas públicas de login e cadastro registradas na Sprint 2.

---

### Sprint 2: Cadastro de Usuário

**Funcionalidade:** Cadastro de usuário com dados pessoais e endereço completo.

**Descrição:** A tela de cadastro permite que o usuário informe nome, sobrenome, e-mail, CPF, telefone, senha e endereço. O fluxo foi dividido em etapas para melhorar a organização do formulário e reduzir a quantidade de campos exibidos ao mesmo tempo.

<img src="images/nimbly_telaCadastro1.png" width="90%">

<img src="images/nimbly_telaCadastro2.png" width="90%">

**Etapas do fluxo:**

- Dados pessoais: nome, sobrenome, e-mail, CPF, DDD, telefone e senha.
- Endereço: CEP, rua, bairro, cidade, estado e número.
- Finalização: botão de cadastro com envio dos dados para a API.

---

### Sprint 2: Login

**Funcionalidade:** Autenticação do usuário cadastrado.

**Descrição:** A tela de login permite acessar o painel de controle por meio de e-mail e senha. A interface também oferece navegação para o cadastro de novos usuários.

<img src="images/nimbly_telaLogin.png" width="90%">

---

### Sprint 3: Dashboard Climático

**Funcionalidade:** Painel de monitoramento climático em tempo real via GPS.

**Descrição:** O dashboard apresenta indicadores resumidos de temperatura, máxima/mínima, chuva acumulada e status geral, além de gráficos de temperatura, precipitação e vento. O usuário pode alternar o período de análise entre 6h, 12h, 24h e 7 dias.

<img src="images/nimbly_telaHome1.png" width="90%">

<img src="images/nimbly_telaHome2.png" width="90%">

---

### Sprint 3: Sensores

**Funcionalidade:** Monitoramento e gerenciamento dos sensores ambientais.

**Descrição:** A tela de sensores mostra o total de sensores cadastrados, quantidade online, quantidade offline, sensores com bateria baixa e uma tabela paginada com ID, localização, status, bateria e última atualização.

<img src="images/nimbly_telaSensores.jpeg" width="90%">

---

### Sprint 3: Detalhe do Sensor

**Funcionalidade:** Visualização detalhada de um sensor específico.

**Descrição:** A tela de detalhe exibe tipo do sensor, nível de bateria, endereço, última comunicação, localização por latitude/longitude e histórico de medições com momento, tipo, valor e unidade.

<img src="images/nimbly_telaInfoCadaSensor.jpeg" width="90%">

---

### Sprint 4: Minha Conta

**Funcionalidade:** Consulta e edição dos dados do usuário logado.

**Descrição:** A tela de conta reúne um resumo do usuário e um formulário de edição de dados pessoais, telefone e endereço. Para salvar alterações, o sistema solicita a senha atual como confirmação.

<img src="images/nimbly_telaMinhaConta1.png" width="90%">

<img src="images/nimbly_telaMinhaConta2.png" width="90%">

---

### Sprint 4: Relatório Inteligente

**Funcionalidade:** Geração de relatório textual com apoio de IA.

**Descrição:** A tela de relatório inteligente apresenta o contexto enviado para análise, incluindo local, origem dos dados, período, máxima/mínima, vento médio e pontos analisados. A partir dessas métricas, o usuário pode gerar um relatório textual sobre o cenário climático.

<img src="images/nimbly_telaRelatorio.png" width="90%">

---

## 5.2. Observações Sobre as Capturas

Os prints apresentados nesta seção estão salvos na pasta `docs/images/` e registram as telas implementadas no navegador. A galeria deve continuar sendo atualizada a cada sprint sempre que novas telas ou fluxos forem entregues.
