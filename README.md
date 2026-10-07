# Verzel Store --- Teste Técnico de QA

Projeto de QA desenvolvido para validar regras de negócio da **Verzel
Store** em três camadas complementares: **teste manual da interface**,
**teste de API com Postman** e **automação E2E com Playwright +
TypeScript**.

A estratégia foi construída para não limitar a avaliação à interface. Os
mesmos critérios de aceite foram analisados sob a perspectiva do
usuário, da API e do fluxo automatizado de checkout, permitindo comparar
comportamentos e identificar inconsistências entre camadas.

## Resumo da execução

  Indicador                             Resultado
  ------------------------ ----------------------
  Registros avaliados                          20
  Aprovados                                    17
  Bugs reportados                               3
  Evidências preservadas                       41
  Automação Playwright       8/8 testes aprovados

### Defeitos identificados

  -----------------------------------------------------------------------
  ID            Critério      Camada        Severidade    Resumo
  ------------- ------------- ------------- ------------- ---------------
  BUG-001       CA06          UI / regra de Alta 
                              severidade de               Frete grátis
                              negócio                     não aplicado no
                                                          subtotal exato
                                                          de R$ 200,00

  BUG-002       CA08          UI / regra de Média 
                              severidade de negócio        Informação de
                              negócio                     valor faltante
                                                          para frete
                                                          grátis fica
                                                          inconsistente
                                                          após aplicação
                                                          do cupom

  BUG-003       CA10          API     Alta severidade
                                      de negócio          API aceita 6
                                                          unidades apesar
                                                          do limite
                                                          máximo de 5
  -----------------------------------------------------------------------

O **BUG-003** merece atenção especial porque evidencia uma diferença
entre as camadas: a restrição de quantidade é respeitada na interface,
mas pode ser contornada por uma requisição direta à API.

------------------------------------------------------------------------

## Escopo validado

Os testes cobriram os critérios de aceite fornecidos para cupom, frete,
quantidade, arredondamento e checkout.

  ---------------------------------------------------------------------
  Critério                           Regra validada
  ---------------------------------- ----------------------------------
  CA01                               Cupom `BEMVINDO10` aplica 10%
                                     sobre o subtotal dos produtos

  CA02                               Cupom ignora diferenças entre
                                     maiúsculas/minúsculas e espaços
                                     nas extremidades

  CA03                               Cupom inexistente retorna
                                     `Cupom inválido.` sem desconto

  CA04                               Cupom expirado retorna
                                     `Cupom expirado.` sem desconto

  CA05                               Somente um cupom pode permanecer
                                     aplicado por vez

  CA06                               Frete grátis para subtotal a
                                     partir de R\$ 200,00, inclusive

  CA07                               Abaixo de R\$ 200,00, frete fixo
                                     de R\$ 19,90 e informação do valor
                                     faltante

  CA08                               Regra de frete considera o
                                     subtotal antes do desconto;
                                     desconto não incide sobre o frete

  CA10                               Máximo de 5 unidades por produto
                                     na interface e na API

  CA11                               Valores monetários arredondados
                                     para duas casas decimais

  Checkout                           Validação de nome, e-mail, CEP e
                                     pagamento na entrega
  ---------------------------------------------------------------------

------------------------------------------------------------------------

# 1. Testes manuais

A primeira etapa foi a execução funcional diretamente na aplicação Web.

O objetivo foi validar o comportamento percebido pelo usuário,
incluindo:

-   aplicação e remoção de cupons;
-   variações de caixa e espaços no código do cupom;
-   mensagens para cupom inválido e expirado;
-   cálculo do desconto;
-   cálculo e limite do frete grátis;
-   valor faltante para obtenção de frete grátis;
-   quantidade máxima por produto;
-   arredondamento de valores;
-   comportamento do carrinho e checkout.

Foram utilizados cenários positivos, negativos e de limite.

As evidências visuais foram mantidas no relatório de execução. O
documento final contém **41 evidências**, numeradas e relacionadas aos
respectivos critérios de aceite.

### Rastreabilidade das evidências

  Evidências   Critério                              Origem
  ------------ ------------------------------------- -------------------------------
  01--03       CA01 --- BEMVINDO10                   Teste manual / UI
  04--06       CA02 --- Case insensitive e trim      Teste manual / UI
  07--10       CA03 --- Cupom inexistente            Teste manual / UI
  11--13       CA04 --- Cupom expirado               Teste manual / UI
  14--20       CA05 --- Um cupom por vez / remoção   Teste manual / UI
  21--26       CA06 --- Frete grátis \>= R\$ 200     Teste manual / UI
  27--30       CA07 --- Frete abaixo de R\$ 200      Teste manual / UI
  31--32       CA08 --- Desconto e frete             Teste manual / UI
  33--35       CA10 --- Limite na interface          Teste manual / UI
  36--39       CA10 --- Limite pela API              API / Postman
  40--41       CA11 --- Arredondamento               Evidência original do cenário

------------------------------------------------------------------------

# 2. Testes de API --- Postman

A API foi validada utilizando **Postman**.

A abordagem não foi apenas verificar se a requisição retornava sucesso.
A API foi usada para validar se as regras de negócio também estavam
protegidas no backend.

O principal teste foi relacionado ao **CA10 --- limite máximo de 5
unidades por produto**.

### Comportamento esperado

Uma requisição contendo quantidade superior a 5 unidades deveria ser
rejeitada ou impedida pela regra de negócio.

### Comportamento encontrado

A requisição com **6 unidades do produto P001** foi processada com
sucesso e a API retornou a quantidade 6 no payload.

Isso originou o:

**BUG-003 --- API permite quantidade superior ao máximo de 5 unidades
por produto.**

### Impacto

Mesmo que a interface limite a quantidade, um consumidor da API consegue
contornar essa validação. Portanto, a regra não pode depender
exclusivamente do frontend.

As evidências do Postman estão registradas no relatório nas **evidências
36 a 39**.

> Nesta entrega, o Postman foi a ferramenta utilizada para a execução da
> API. Não é afirmado neste README que Newman ou execução automatizada
> da Collection foram utilizados, pois isso não fez parte da execução
> registrada.

------------------------------------------------------------------------

# 3. Automação E2E --- Playwright

A automação foi desenvolvida com:

-   **Playwright**
-   **TypeScript**
-   **Chromium**
-   organização com **Page Object**
-   fixtures/massa de dados para o checkout

A suíte prepara o estado real da aplicação adicionando um produto ao
carrinho, acessa o carrinho, segue para o checkout e então executa as
validações do formulário.

### Cobertura automatizada registrada

  Teste             Dado / regra                              Resultado
  ----------------- ----------------------------------------- -----------
  Nome válido       `Daniel Pinheiro`                         PASSOU
  Nome inválido     `Daniel`                                  PASSOU
  E-mail válido     `daniel@teste.com`                        PASSOU
  E-mail inválido   `daniel@teste`                            PASSOU
  CEP sem hífen     `70000000`                                PASSOU
  CEP com hífen     `70000-000`                               PASSOU
  CEP inválido      `7000000`                                 PASSOU
  Pagamento         Pagamento na entrega / sem etapa online   PASSOU

**Resultado registrado: 8 testes executados e 8 aprovados.**

A execução foi realizada em **1 worker**, utilizando Chromium.

------------------------------------------------------------------------

## Estrutura da automação

A estrutura trabalhada no projeto Playwright é:

``` text
verzel-store-playwright/
├── features/
├── fixtures/
│   └── checkout.data.ts
├── pages/
│   └── CheckoutPage.ts
├── tests/
│   └── checkout.spec.ts
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

### Responsabilidade das principais partes

`tests/checkout.spec.ts` concentra os cenários automatizados e as
asserções.

`pages/CheckoutPage.ts` encapsula elementos e ações da página de
checkout, seguindo a ideia de Page Object para reduzir duplicação e
melhorar a manutenção.

`fixtures/checkout.data.ts` mantém dados utilizados pelos testes
separados da lógica de execução.

`playwright.config.ts` contém a configuração do Playwright, incluindo o
diretório de testes, timeouts, `baseURL`, Chromium, screenshots em
falha, vídeo em falha e trace na primeira repetição.

------------------------------------------------------------------------

# 4. Como executar a automação

## Pré-requisitos

-   Node.js instalado;
-   npm disponível;
-   dependências do projeto instaladas.

Na raiz do projeto:

``` bash
npm install
```

Instale os navegadores do Playwright, caso ainda não estejam
disponíveis:

``` bash
npx playwright install
```

### Executar todos os testes

``` bash
npx playwright test
```

### Executar acompanhando o navegador

``` bash
npx playwright test --headed
```

### Executar apenas o checkout

``` bash
npx playwright test tests/checkout.spec.ts --headed
```

### Executar um cenário por tag/nome

Exemplo:

``` bash
npx playwright test --grep "@pagamento" --headed --reporter=line
```

### Abrir o relatório HTML

``` bash
npx playwright show-report
```

A configuração utilizada aponta para o ambiente de teste:

``` text
https://verzel-store.qa-test-verzel-store.workers.dev
```

------------------------------------------------------------------------

# 5. Evidências e documentação

Além do código, a entrega foi tratada como uma execução de QA auditável.

Foram produzidos:

-   matriz/planilha de execução;
-   cenários e critérios de aceite;
-   relatório consolidado;
-   41 evidências de execução;
-   registro dos bugs encontrados;
-   evidências de API no Postman;
-   suíte automatizada Playwright;
-   resultado da execução automatizada.

Para o GitHub, a proposta é manter a documentação separada do código:

``` text
docs/
├── evidencias/
├── relatorio/
└── planilha/
```

Arquivos de execução temporários, caches, `node_modules`, vídeos e
traces locais não devem ser versionados indiscriminadamente. Evidências
relevantes para a avaliação podem ser mantidas de forma intencional em
`docs/evidencias/`.

------------------------------------------------------------------------

# 6. Uso de Inteligência Artificial

A IA foi utilizada como **ferramenta de apoio ao trabalho de QA**, e não
como substituição da execução ou da validação humana.

Ela entrou principalmente em quatro pontos:

### Apoio na estruturação dos testes

A IA auxiliou na organização dos critérios de aceite em cenários
testáveis, ajudando a separar casos positivos, negativos e de limite.

### Apoio na automação Playwright

Foi utilizada como apoio para estruturar e revisar o código
TypeScript/Playwright, incluindo seletores, fluxo de preparação do
checkout, Page Object, fixtures e diagnóstico de falhas durante a
construção da suíte.

------------------------------------------------------------------------

# 7. Principais resultados

A estratégia em múltiplas camadas permitiu identificar situações que
poderiam passar despercebidas caso apenas uma abordagem fosse utilizada.

O teste manual identificou comportamentos relacionados a **frete e
apresentação da regra ao usuário**.

O teste de API demonstrou que a regra de **máximo de 5 unidades** não
estava protegida de forma consistente no backend.

A automação Playwright criou uma base de regressão para o **checkout**,
com **8/8 testes aprovados** na execução registrada.

Essa combinação demonstra a função de QA não apenas como execução de
casos de teste, mas como validação da qualidade do produto em diferentes
níveis da aplicação.

------------------------------------------------------------------------


## Autor

**Daniel Pinheiro**\
Analista de QA

Teste técnico --- Verzel Store\
06 de outubro de 2026
