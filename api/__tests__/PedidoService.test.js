const PedidoService = require("../services/PedidoService");

// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()), assim testamos so a
// logica do service, sem depender de dados reais.
//
// IMPORTANTE: as validacoes (cliente, itens, status) ficam no REPOSITORY.
// Como aqui ele e um mock, para simular esses erros usamos
// mockImplementation(() => { throw ... }) e verificamos que o service
// deixa o erro passar ("propaga o erro").

describe("PedidoService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    service = new PedidoService(mockRepository);
  });

  describe("listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const pedidos = [{ id: 1, cliente: "Ana Souza", itens: [], status: "pendente", total: 0 }];
      mockRepository.findAll.mockReturnValue(pedidos);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(pedidos);
    });
  });

  describe("buscarPorId", () => {
    test("repassa o id ao repository e retorna o pedido encontrado", () => {
      const pedido = { id: 1, cliente: "Ana Souza", itens: [], status: "pendente", total: 0 };
      mockRepository.findById.mockReturnValue(pedido);

      const resultado = service.buscarPorId(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(pedido);
    });

    test("lanca erro 'Pedido nao encontrado' quando o repository retorna null", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.buscarPorId(1)).toThrow("Pedido nao encontrado");
    });
  });

  describe("criar", () => {
    test("repassa os dados ao repository e retorna o pedido criado com o total calculado", () => {
      const dadosNovoPedido = {
        cliente: "Ana Souza",
        itens: [{ nome: "Coxinha", precoUnitario: 5, quantidade: 2 }],
      };
      const pedidoCriado = { id: 1, ...dadosNovoPedido, status: "pendente", total: 10 };

      mockRepository.create.mockReturnValue(pedidoCriado);

      const resultado = service.criar(dadosNovoPedido);

      expect(mockRepository.create).toHaveBeenCalledWith(dadosNovoPedido);
      expect(resultado).toEqual(pedidoCriado);
    });

    test("propaga o erro quando o cliente estiver faltando", () => {
      const dadosSemCliente = {
        itens: [{ nome: "Coxinha", precoUnitario: 5, quantidade: 2 }],
      };

      mockRepository.create.mockImplementation(() => {
        throw new Error("Cliente e obrigatorio");
      });

      expect(() => service.criar(dadosSemCliente)).toThrow("Cliente e obrigatorio");
    });

    test("propaga o erro quando a lista de itens estiver vazia", () => {
      const dadosSemItens = { cliente: "Ana Souza", itens: [] };

      mockRepository.create.mockImplementation(() => {
        throw new Error("O pedido precisa ter ao menos um item");
      });

      expect(() => service.criar(dadosSemItens)).toThrow(
        "O pedido precisa ter ao menos um item",
      );
    });

    test("propaga o erro quando algum item tiver preco ou quantidade invalidos", () => {
      const dadosItemInvalido = {
        cliente: "Ana Souza",
        itens: [{ nome: "Coxinha", precoUnitario: -5, quantidade: 0 }],
      };

      mockRepository.create.mockImplementation(() => {
        throw new Error("Item com preco ou quantidade invalidos");
      });

      expect(() => service.criar(dadosItemInvalido)).toThrow(
        "Item com preco ou quantidade invalidos",
      );
    });
  });

  describe("atualizarStatus", () => {
    test("chama repository.findById e repository.updateStatus quando o pedido existe", () => {
      const pedidoExistente = { id: 1, cliente: "Ana", status: "pendente" };
      const pedidoAtualizado = { ...pedidoExistente, status: "pago" };

      mockRepository.findById.mockReturnValue(pedidoExistente);
      mockRepository.updateStatus.mockReturnValue(pedidoAtualizado);

      const resultado = service.atualizarStatus(1, "pago");

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(1, "pago");
      expect(resultado).toEqual(pedidoAtualizado);
    });

    test("lanca erro 'Pedido nao encontrado' sem chamar repository.updateStatus quando o pedido nao existe", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.atualizarStatus(1, "pago")).toThrow("Pedido nao encontrado");
      expect(mockRepository.updateStatus).not.toHaveBeenCalled();
    });

    test("propaga o erro quando o novo status for invalido", () => {
      const pedidoExistente = { id: 1, cliente: "Ana", status: "pendente" };
      mockRepository.findById.mockReturnValue(pedidoExistente);
      mockRepository.updateStatus.mockImplementation(() => {
        throw new Error("Status invalido");
      });

      expect(() => service.atualizarStatus(1, "entregue")).toThrow("Status invalido");
    });

    test("propaga o erro quando o pedido ja estiver cancelado", () => {
      const pedidoCancelado = { id: 1, cliente: "Ana", status: "cancelado" };
      mockRepository.findById.mockReturnValue(pedidoCancelado);
      mockRepository.updateStatus.mockImplementation(() => {
        throw new Error("Pedido cancelado nao pode ser alterado");
      });

      expect(() => service.atualizarStatus(1, "pago")).toThrow(
        "Pedido cancelado nao pode ser alterado",
      );
    });
  });

  describe("remover", () => {
    test("chama repository.delete com o id correto quando o pedido existe", () => {
      mockRepository.delete.mockReturnValue(true);

      service.remover(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test("lanca erro 'Pedido nao encontrado' quando o repository retorna false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(1)).toThrow("Pedido nao encontrado");
    });
  });
});