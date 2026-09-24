const request = require('supertest');
const createApp = require('../app');

// Teste de integracao: testa a API de pedidos de ponta a ponta via HTTP real.
// Cada teste recebe uma app nova (factory), garantindo estado isolado.

describe('API /pedidos (integracao com supertest)', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /pedidos', () => {
    test('retorna 200 e a lista de pedidos iniciais', async () => {
      const res = await request(app).get('/pedidos');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /pedidos/:id', () => {
    test('retorna 200 e o pedido quando o id existe', async () => {
      const res = await request(app).get('/pedidos/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('cliente');
      expect(res.body).toHaveProperty('itens');
      expect(res.body).toHaveProperty('total');
    });

    test('retorna 404 com mensagem de erro quando o pedido nao existe', async () => {
      const res = await request(app).get('/pedidos/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });
  });

  describe('POST /pedidos', () => {
    test('retorna 201 e o pedido criado com o total calculado corretamente', async () => {
      const novoPedido = {
        cliente: 'Carlos Silva',
        itens: [
          { nome: 'Coxinha', precoUnitario: 5, quantidade: 2 },      // 10
          { nome: 'Refrigerante', precoUnitario: 6, quantidade: 1 }, // 6
        ],
      };

      const res = await request(app).post('/pedidos').send(novoPedido);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.cliente).toBe('Carlos Silva');
      expect(res.body.total).toBe(16); // Soma: (5*2) + (6*1) = 16
      expect(res.body.status).toBe('pendente');
    });

    test('retorna 400 quando o cliente estiver faltando', async () => {
      const res = await request(app).post('/pedidos').send({
        itens: [{ nome: 'Coxinha', precoUnitario: 5, quantidade: 1 }],
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 400 quando a lista de itens estiver vazia', async () => {
      const res = await request(app).post('/pedidos').send({
        cliente: 'Carlos Silva',
        itens: [],
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 400 quando algum item tiver preco ou quantidade invalidos', async () => {
      const res = await request(app).post('/pedidos').send({
        cliente: 'Carlos Silva',
        itens: [{ nome: 'Coxinha', precoUnitario: -5, quantidade: 0 }],
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });
  });

  describe('PATCH /pedidos/:id/status', () => {
    test('retorna 200 e o pedido com o novo status quando o id existe', async () => {
      const res = await request(app)
        .patch('/pedidos/1/status')
        .send({ status: 'pago' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('pago');
    });

    test('retorna 404 quando o pedido nao existe', async () => {
      const res = await request(app)
        .patch('/pedidos/999/status')
        .send({ status: 'pago' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 400 quando o status enviado for invalido', async () => {
      const res = await request(app)
        .patch('/pedidos/1/status')
        .send({ status: 'entregue' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 400 ao tentar alterar o status de um pedido ja cancelado', async () => {
      // 1. Cancele o pedido id 1 primeiro via PATCH
      await request(app)
        .patch('/pedidos/1/status')
        .send({ status: 'cancelado' });

      // 2. Tente alterar o status novamente para 'pago'
      const res = await request(app)
        .patch('/pedidos/1/status')
        .send({ status: 'pago' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });
  });

  describe('DELETE /pedidos/:id', () => {
    test('retorna 204 quando o pedido e removido com sucesso', async () => {
      const res = await request(app).delete('/pedidos/1');

      expect(res.status).toBe(204);
    });

    test('pedido removido nao deve mais aparecer em GET /pedidos/:id', async () => {
      await request(app).delete('/pedidos/1');

      const getRes = await request(app).get('/pedidos/1');

      expect(getRes.status).toBe(404);
      expect(getRes.body).toHaveProperty('erro');
    });

    test('retorna 404 com mensagem de erro quando o pedido nao existir', async () => {
      const res = await request(app).delete('/pedidos/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });
  });
});