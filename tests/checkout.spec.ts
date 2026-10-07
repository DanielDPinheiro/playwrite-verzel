import { test, expect, Page } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { clienteValido } from '../fixtures/checkout.data';


async function prepararCheckout(page: Page) {
  // Abre a loja
  await page.goto('/');

  // Localiza a Camiseta Essencial
  const produto = page.getByText('Camiseta Essencial', {
    exact: true
  });

  await expect(produto).toBeVisible();

  // Localiza o card do produto
  const card = produto.locator('..').locator('..');

  // Localiza botão do produto
  const botaoAdicionar = card.getByRole('button').first();

  await expect(botaoAdicionar).toBeVisible();

  // Adiciona produto
  await botaoAdicionar.click();

  // Abre o carrinho
  await page.getByRole('link', {
    name: /carrinho/i
  }).click();

  // Valida página do carrinho
  await expect(page).toHaveURL(/\/carrinho/);

  // Valida produto no carrinho
  await expect(
    page.getByText('Camiseta Essencial', {
      exact: true
    })
  ).toBeVisible();

  // Finalizar compra
 const finalizarCompra = page.getByText('Finalizar compra', {
  exact: true
});

await expect(finalizarCompra).toBeVisible();

await finalizarCompra.click();

  // Valida entrada no checkout
  await expect(page).toHaveURL(/\/checkout/);

  await expect(
    page.getByRole('heading', {
      name: 'Finalizar compra'
    })
  ).toBeVisible();
}


test.describe('Checkout - regras existentes', () => {

  test.beforeEach(async ({ page }) => {
    await prepararCheckout(page);
  });


  test('@nome @positivo - aceitar nome e sobrenome', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.preencherDados(
      'Daniel Pinheiro',
      'daniel@teste.com',
      '70000000'
    );

    await expect(checkout.nomeCompleto)
      .toHaveValue('Daniel Pinheiro');
  });


  test('@nome @negativo - rejeitar apenas primeiro nome', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.preencherDados(
      'Daniel',
      'daniel@teste.com',
      '70000000'
    );

    await checkout.confirmar();

    // O pedido não pode ser concluído
    await expect(page).toHaveURL(/\/checkout/);
  });


  test('@email @positivo - aceitar e-mail válido', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.preencherDados(
      'Daniel Pinheiro',
      'daniel@teste.com',
      '70000000'
    );

    await expect(checkout.email)
      .toHaveValue('daniel@teste.com');
  });


  test('@email @negativo - rejeitar e-mail inválido', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.preencherDados(
      'Daniel Pinheiro',
      'daniel@teste',
      '70000000'
    );

    await checkout.confirmar();

    await expect(page).toHaveURL(/\/checkout/);
  });


  test('@cep @positivo - aceitar CEP sem hífen', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.preencherDados(
      'Daniel Pinheiro',
      'daniel@teste.com',
      '70000000'
    );

    await expect(checkout.cep)
      .toHaveValue('70000000');
  });


  test('@cep @positivo - aceitar CEP com hífen', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.preencherDados(
      'Daniel Pinheiro',
      'daniel@teste.com',
      '70000-000'
    );

    await expect(checkout.cep)
      .toHaveValue('70000-000');
  });


  test('@cep @negativo - rejeitar CEP inválido', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.preencherDados(
      'Daniel Pinheiro',
      'daniel@teste.com',
      '7000000'
    );

    await checkout.confirmar();

    await expect(page).toHaveURL(/\/checkout/);
  });


  test('@pagamento - pagamento deve ser feito na entrega', async ({ page }) => {

    await expect(
      page.getByText('O pagamento é feito na entrega.')
    ).toBeVisible();

  });

});