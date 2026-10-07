# language: pt
Funcionalidade: Validação dos dados do checkout

  @checkout @nome @positivo
  Cenário: Aceitar cliente com nome e sobrenome
    Dado que estou preenchendo os dados do checkout
    Quando informar o nome "Daniel Pinheiro"
    Então o nome deve ser considerado válido

  @checkout @nome @negativo
  Cenário: Não permitir apenas o primeiro nome
    Dado que estou preenchendo os dados do checkout
    Quando informar o nome "Daniel"
    E tentar finalizar o pedido
    Então o sistema deve impedir a conclusão do pedido

  @checkout @email @positivo
  Cenário: Aceitar e-mail válido
    Dado que estou preenchendo os dados do checkout
    Quando informar o e-mail "daniel@teste.com"
    Então o e-mail deve ser considerado válido

  @checkout @email @negativo
  Cenário: Rejeitar e-mail com formato inválido
    Dado que estou preenchendo os dados do checkout
    Quando informar o e-mail "daniel@teste"
    E tentar finalizar o pedido
    Então o sistema deve impedir a conclusão do pedido

  @checkout @cep
  Esquema do Cenário: Aceitar CEP válido com ou sem hífen
    Dado que estou preenchendo os dados do checkout
    Quando informar o CEP "<cep>"
    Então o CEP deve ser considerado válido

    Exemplos:
      | cep       |
      | 70000000  |
      | 70000-000 |

  @checkout @cep @negativo
  Cenário: Rejeitar CEP inválido
    Dado que estou preenchendo os dados do checkout
    Quando informar o CEP "7000000"
    E tentar finalizar o pedido
    Então o sistema deve impedir a conclusão do pedido

  @checkout @pagamento
  Cenário: Finalizar pedido sem pagamento online
    Dado que preenchi corretamente os dados do cliente
    E possuo produtos válidos no carrinho
    Quando finalizar o pedido
    Então o pedido deve ser criado
    E o pagamento deve ser definido como pagamento na entrega
    E nenhuma etapa de pagamento online deve ser apresentada
