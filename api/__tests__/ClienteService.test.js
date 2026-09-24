const ClienteService = require("../services/ClienteService");

// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()), assim testamos so a
// logica do service, sem depender de dados reais.
//
// IMPORTANTE: as validacoes (nome/email obrigatorios, email unico) ficam no
// REPOSITORY. Como aqui ele e um mock, para simular esses erros usamos
// mockImplementation(() => { throw ... }) e verificamos que o service
// deixa o erro passar ("propaga o erro").

describe("ClienteService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new ClienteService(mockRepository);
  });

  describe("listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const clientes = [{ id: 1, nome: "Ana Souza", email: "ana@email.com" }];
      mockRepository.findAll.mockReturnValue(clientes);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(clientes);
    });
  });

  describe("buscarPorId", () => {
    test("repassa o id ao repository e retorna o cliente encontrado", () => {
      const cliente = { id: 1, nome: "Ana Livia", email: "ana_Livia@email.com" };
      mockRepository.findById.mockReturnValue(cliente);

      const resultado = service.buscarPorId(1);

      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(cliente);
    });

    test("lanca erro 'Cliente nao encontrado' quando o repository retorna null", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.buscarPorId(1)).toThrow("Cliente nao encontrado");
    });
  });

  describe("criar", () => {
    test("repassa os dados ao repository e retorna o cliente criado", () => {
      const dadosNovoCliente = { nome: "Ana Souza", email: "ana@email.com" };
      const clienteCriado = { id: 1, ...dadosNovoCliente };

      mockRepository.create.mockReturnValue(clienteCriado);

      const resultado = service.criar(dadosNovoCliente);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(dadosNovoCliente);
      expect(resultado).toEqual(clienteCriado);
    });

    test("propaga o erro quando nome ou email estiverem faltando", () => {
      const dadosIncompletos = { email: "ana@email.com" }; // faltando 'nome'

      // O repository real lanca esse erro; aqui o mock simula o comportamento
      mockRepository.create.mockImplementation(() => {
        throw new Error("Nome e email sao obrigatorios");
      });

      expect(() => service.criar(dadosIncompletos)).toThrow(
        "Nome e email sao obrigatorios",
      );
    });

    test("propaga o erro quando o email ja estiver cadastrado", () => {
      const dadosNovoCliente = { nome: "Outra Ana", email: "ana@email.com" };

      mockRepository.create.mockImplementation(() => {
        throw new Error("Email ja cadastrado");
      });

      expect(() => service.criar(dadosNovoCliente)).toThrow(
        "Email ja cadastrado",
      );
    });
  });

  describe("atualizar", () => {
    test("chama repository.findById e repository.update quando o cliente existe", () => {
      const clienteExistente = { id: 1, nome: "Ana", email: "ana@email.com" };
      const dadosNovos = { nome: "Ana Livia", email: "ana@email.com" };
      const clienteAtualizado = { id: 1, ...dadosNovos };

      mockRepository.findById.mockReturnValue(clienteExistente);
      mockRepository.update.mockReturnValue(clienteAtualizado);

      const resultado = service.atualizar(1, dadosNovos);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, dadosNovos);
      expect(resultado).toEqual(clienteAtualizado);
    });

    test("lanca erro 'Cliente nao encontrado' sem chamar repository.update quando o cliente nao existe", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.atualizar(1, { nome: "Ana" })).toThrow(
        "Cliente nao encontrado",
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    test("propaga o erro quando o novo email ja pertence a outro cliente", () => {
      const clienteExistente = { id: 1, nome: "Ana", email: "ana@email.com" };
      const dadosDuplicados = { nome: "Ana", email: "carlos@email.com" };

      mockRepository.findById.mockReturnValue(clienteExistente);
      mockRepository.update.mockImplementation(() => {
        throw new Error("Email ja cadastrado");
      });

      expect(() => service.atualizar(1, dadosDuplicados)).toThrow(
        "Email ja cadastrado",
      );
    });
  });

  describe("remover", () => {
    test("chama repository.delete com o id correto quando o cliente existe", () => {
      mockRepository.delete.mockReturnValue(true);

      service.remover(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test("lanca erro 'Cliente nao encontrado' quando o repository retornar false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(1)).toThrow("Cliente nao encontrado");
    });
  });
});