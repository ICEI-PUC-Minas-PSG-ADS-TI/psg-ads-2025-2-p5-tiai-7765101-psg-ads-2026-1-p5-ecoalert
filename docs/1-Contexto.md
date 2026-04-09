# 1. Introdução

Nesta seção, você vai apresentar **o contexto e a motivação do seu projeto**, explicando o problema que ele resolve, o que pretende alcançar e para quem ele é útil.

---

## 1.1 Problema  
Moradores de áreas de risco e autoridades de defesa civil enfrentam dificuldades para agir a tempo contra enchentes, pois as informações meteorológicas são fragmentadas e chegam tarde demais. Essa demora na comunicação de emergência atrasa evacuações e resulta em perdas materiais e de vidas.

---

## 1.2 Objetivos  
Objetivo Geral:
- Desenvolver uma plataforma digital inteligente para monitoramento em tempo real, emissão de alertas e prevenção de desastres causados por enchentes em áreas vulneráveis.

Objetivos Específicos:

- Integrar dados climáticos, geográficos e indicadores ambientais em um único painel de controle (dashboard) centralizado.

- Implementar um sistema de alertas automáticos multicanal (como SMS e notificações no celular) para avisar a população e as autoridades quando limites de risco forem atingidos.

- Fornecer métricas e informações em tempo real que auxiliem a Defesa Civil na tomada de decisão rápida e na organização de evacuações preventivas.

---

## 1.3 Justificativa  
Segundo dados do Centro Nacional de Monitoramento e Alertas de Desastres Naturais (CEMADEN), mais de 8 milhões de brasileiros vivem em áreas de risco propensas a desastres naturais. O projeto vale a pena pois transforma dados brutos em alertas rápidos, agilizando o resgate por parte das autoridades e dando à população o tempo necessário para se proteger, salvando vidas e reduzindo prejuízos.

---

## 1.4 Público-Alvo  
- Autoridades (ex: Defesa Civil): Profissionais com conhecimento técnico intermediário que usarão o sistema no computador (painel central) para monitorar riscos e coordenar equipes.

- Moradores de áreas de risco: Pessoas de todas as idades e níveis de conhecimento tecnológico, que usarão o celular apenas para receber alertas de emergência de forma simples e direta.
---

## 1.5 Lista Macro de Funcionalidades

Conforme a delimitação do público-alvo, o sistema Nimbly (EcoAlert) é dividido em dois grandes módulos funcionais para atender tanto à gestão de desastres quanto à ponta final (os cidadãos).

### 1. Módulo da Defesa Civil (Painel Gerencial)
Focado no controle e monitoramento por parte das autoridades competentes:
* **Gestão de Áreas de Risco:** Cadastro, edição e mapeamento de comunidades vulneráveis.
* **Monitoramento Climático:** Integração e consumo de dados em tempo real de APIs públicas meteorológicas e de desastres (ex: CEMADEN, INMET/INPE) para basear decisões.
* **Disparo de Alertas:** Painel para envio de notificações de emergência para os moradores das áreas afetadas.

### 2. Módulo do Morador (Portal de Alertas)
Focado na simplicidade e no acesso rápido à informação para o cidadão:
* **Cadastro e Geolocalização:** Criação de conta vinculada a um endereço físico para recebimento de alertas direcionados.
* **Recepção de Alertas:** Visualização rápida do status de risco da sua região.
* **Mural de Prevenção:** Acesso a diretrizes de segurança e rotas de evacuação em caso de desastres.

---
