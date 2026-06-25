# 6. Conclusão

Esta seção apresenta a conclusão do projeto Nimbly, destacando os resultados alcançados, as limitações encontradas e os principais aprendizados da equipe durante o desenvolvimento.

---

## 6.1 Síntese dos Resultados

O Nimbly foi desenvolvido como uma plataforma digital voltada ao monitoramento climático e à prevenção de riscos em áreas vulneráveis a enchentes. A proposta inicial era centralizar informações importantes em um sistema simples de consultar, ajudando moradores e autoridades a acompanharem condições de risco com mais clareza.

Ao longo do projeto, a equipe conseguiu construir uma aplicação com cadastro de usuários, autenticação segura, gerenciamento de comunidades, consulta de dados climáticos, dashboard com gráficos e módulo de sensores. Também foram desenvolvidas funcionalidades de apoio, como filtragem, ordenação, uso de localização e geração de relatórios.

A solução se conecta diretamente com a ODS 11, Cidades e Comunidades Sustentáveis, pois busca apoiar comunidades em situação de vulnerabilidade e melhorar a resposta diante de desastres. Também se relaciona com a ODS 13, Ação Contra a Mudança Global do Clima, já que utiliza dados climáticos para apoiar decisões preventivas.

Como resultado, o projeto demonstra como a tecnologia pode ser usada para transformar dados em informação útil. Mesmo sendo uma versão acadêmica, o sistema apresenta uma base funcional para monitoramento, tomada de decisão e prevenção de danos causados por chuvas intensas.

---

## 6.2 Limitações e Trabalhos Futuros

Apesar dos avanços, o projeto ainda possui algumas limitações. A principal delas é que o sistema ainda depende de uma estrutura controlada de dados e não está integrado a sensores físicos reais em campo. O módulo de sensores foi preparado no banco e na aplicação, mas em uma versão futura poderia receber leituras automáticas de dispositivos instalados em regiões de risco.

Outra limitação é que o envio de alertas para moradores ainda pode ser expandido. A proposta do projeto considera alertas rápidos, mas uma próxima versão poderia incluir notificações por SMS, WhatsApp, e-mail ou push notification no celular.

Também há espaço para melhorar a parte de mapas e geolocalização. Com mais tempo, o sistema poderia exibir comunidades e sensores em um mapa interativo, calcular distância entre moradores e áreas de risco e identificar automaticamente quais regiões devem receber determinado alerta.

Para uma versão futura do Nimbly, a equipe sugere:

* Integração com sensores físicos reais;
* Envio automático de alertas para moradores;
* Mapa interativo com comunidades, sensores e áreas de risco;
* Aplicativo mobile para facilitar o acesso da população;
* Melhoria do módulo de IA para gerar recomendações preventivas;
* Deploy completo da aplicação em ambiente de produção;
* Mais testes de segurança, desempenho e usabilidade.

---

## 6.3 Lições Aprendidas

Durante o desenvolvimento, a equipe aprendeu a importância de organizar o projeto em entregas menores e funcionais. Trabalhar com fatias verticais ajudou a entender que uma funcionalidade não depende apenas da tela, mas também do banco de dados, da API, das validações e dos testes.

Um dos maiores desafios foi integrar todas as partes do sistema. O grupo precisou lidar com front-end em React, back-end em Node.js com TypeScript, banco PostgreSQL com Prisma, autenticação com JWT e consumo de APIs externas. Essa integração exigiu atenção, comunicação e revisão constante.

Outro aprendizado importante foi o uso do GitHub como ferramenta de versionamento e acompanhamento do trabalho. A equipe percebeu que commits bem organizados, divisão de tarefas e revisão de código facilitam muito o desenvolvimento em grupo.

Também ficou claro que a documentação precisa acompanhar o sistema. Conforme o projeto evoluiu, foi necessário atualizar requisitos, planejamento, modelagem do banco, telas e instruções de uso para que a documentação representasse o software real.

No geral, o projeto permitiu que a equipe aplicasse conhecimentos técnicos e de organização em uma solução com propósito social. Além do aprendizado em programação, o Nimbly mostrou como sistemas digitais podem contribuir para prevenção de riscos, apoio à Defesa Civil e proteção de moradores em áreas vulneráveis.

---
