import { expect, Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly nomeCompleto: Locator;
  readonly email: Locator;
  readonly cep: Locator;
  readonly confirmarPedido: Locator;
  readonly pagamentoEntrega: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nomeCompleto = page.getByLabel('Nome completo');
    this.email = page.getByLabel('E-mail');
    this.cep = page.getByLabel('CEP');
    this.confirmarPedido = page.getByRole('button', { name: 'Confirmar pedido' });
    this.pagamentoEntrega = page.getByText('O pagamento é feito na entrega.');
  }

  async preencherDados(nome: string, email: string, cep: string) {
    await this.nomeCompleto.fill(nome);
    await this.email.fill(email);
    await this.cep.fill(cep);
  }

  async confirmar() {
    await this.confirmarPedido.click();
  }

  async validarPagamentoNaEntrega() {
    await expect(this.pagamentoEntrega).toBeVisible();
  }
}
