const ProdutoService = require("../services/ProdutoService");

// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()).
//
// A validacao (nome e preco obrigatorios) fica no REPOSITORY. Como aqui ele
// e um mock, simulamos o erro com mockImplementation(() => { throw ... }) e
// verificamos que o service deixa o erro passar.

describe("ProdutoService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    service = new ProdutoService(mockRepository);
  });

  describe("listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const produtos = [{ id: 1, nome: "Coxinha", preco: 5 }];
      mockRepository.findAll.mockReturnValue(produtos);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(produtos);
    });
  });

  describe("buscarPorId", () => {
    test("repassa o id ao repository e retorna o produto encontrado", () => {
      const produto = { id: 1, nome: "Coxinha", preco: 5 };
      mockRepository.findById.mockReturnValue(produto);

      const resultado = service.buscarPorId(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(produto);
    });

    test("lanca erro 'Produto nao encontrado' quando o repository retorna null", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.buscarPorId(1)).toThrow("Produto nao encontrado");
    });
  });

  describe("criar", () => {
    test("repassa os dados ao repository e retorna o produto criado", () => {
      const dadosNovoProduto = { nome: "Kibe", preco: 4 };
      const produtoCriado = { id: 4, ...dadosNovoProduto };
      mockRepository.create.mockReturnValue(produtoCriado);

      const resultado = service.criar(dadosNovoProduto);

      expect(mockRepository.create).toHaveBeenCalledWith(dadosNovoProduto);
      expect(resultado).toEqual(produtoCriado);
    });

    test("propaga o erro quando nome ou preco estiverem faltando", () => {
      mockRepository.create.mockImplementation(() => {
        throw new Error("Nome e preco sao obrigatorios");
      });

      expect(() => service.criar({ nome: "Kibe" })).toThrow(
        "Nome e preco sao obrigatorios",
      );
    });
  });

  describe("remover", () => {
    test("chama repository.delete com o id correto quando o produto existe", () => {
      mockRepository.delete.mockReturnValue(true);

      service.remover(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test("lanca erro 'Produto nao encontrado' quando o repository retorna false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(1)).toThrow("Produto nao encontrado");
    });
  });
});