const ProdutoService = require("../services/ProdutoService");

// Change 'describre' to 'describe'
describe("ProdutoService- testes unitários", () => {
  let service;
  let mockRepository;
  // ...
});

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(), //função vazia por enquanto que nao faz nada
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    service = new ProdutoService(mockRepository); //produtoService nao precisa saber que o moxk existe

  }); //antes de cada teste acontecer

  describe("listar", () => {
  test("chama repository.findAll uma vez e retorna o resultado", () => {
    const produtos = [{ id: 1, nome: "coxinha", preco: 5 }];
    mockRepository.findAll.mockReturnValue(produtos);

    const resultado = service.listar();

    expect(mockRepository.findAll).toHaveBeenCalledTimes(1); // verifica se foi chamado exatamente 1 vez
    expect(resultado).toEqual(produtos);
  });
});

describe("buscarPorId", () => {
  test("chama repository.findById com o id correto e retorna o produto", () => {
    const produto = { id: 1, nome: "coxinha", preco: 5 };
    mockRepository.findById.mockReturnValue(produto);

    const resultado = service.buscarPorId(1);

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(1); // verifica se recebeu o id 1
    expect(resultado).toEqual(produto); // retorna apenas o objeto encotrado
  });
});

//criar(dados)

describe("criar", () => {
    test("Deve repassar dados para mockRepository.create e retornar o produto criado", () => {
      const dadosNovoProduto = { nome: "Pastel", preco: 6 };
      const produtoCriado = { id: 1, ...dadosNovoProduto };

      mockRepository.create.mockReturnValue(produtoCriado);

      const resultado = service.criar(dadosNovoProduto);

      expect(mockRepository.create).toHaveBeenCalledWith(dadosNovoProduto);
      expect(resultado).toEqual(produtoCriado);
    });

    //Deve propagar o erro lancado pelo repository quando os dados forem invalidos

    test("Deve propagar o erro lançado pelo repository quando os dados forem inválidos", () => {
      const dadosInvalidos = { nome: "" };

      mockRepository.create.mockImplementation(() => {
        throw new Error("Dados inválidos");
      });

      expect(() => {
        service.criar(dadosInvalidos);
      }).toThrow("Dados inválidos");
    });
  });

//remover(id)

  describe("remover", () => {
    test("Deve chamar mockRepository.delete com o id correto quando o produto existe", () => {
      mockRepository.delete.mockReturnValue(true);

      expect(() => {
        service.remover(1);
      }).not.toThrow();

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    //Deve lancar erro 'Produto nao encontrado' quando o repository retornar false

    test("Deve lançar erro 'Produto nao encontrado' quando o repository retornar false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => {
        service.remover(999);
      }).toThrow("Produto nao encontrado");
    });
  });



