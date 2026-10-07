# Verzel Store - Playwright

Testes automatizados de checkout com Playwright + TypeScript.

## Instalação

```powershell
npm install
npx playwright install chromium
```

## Executar

```powershell
npm test
```

ou somente checkout:

```powershell
npm run test:checkout
```

## Relatório

```powershell
npm run report
```

> Observação: o arquivo `.feature` documenta os cenários em Gherkin. A execução atual é feita pelo Playwright Test. Os seletores foram baseados nos textos visíveis da tela fornecida e podem precisar de pequeno ajuste após a primeira execução, principalmente o botão de adicionar produto na página inicial.
