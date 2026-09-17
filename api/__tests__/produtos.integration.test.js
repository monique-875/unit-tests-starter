const request = require("supertest");
const createApp = require("../app"); 
describe("API/produtos - testes de integração", () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe("GET/produtos", () => {
    test("Retorna 200 e um array com produtos iniciais", async () => { 
      const res = await request(app).get("/produtos");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3); //tamanho da resposta 3
    });

    // teste Get/produtos/id =1 ou 2
    describe("GET /produtos/:id", () => {
      test("Retorna 200 e o produto correto para um ID existente", async () => {
        const res = await request(app).get("/produtos/1");

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1); 
        expect(res.body.nome).toBeDefined(); 
      });

      //Extra
      test("Retorna 404 quando o produto não for encontrado", async () => {
        const res = await request(app).get("/produtos/4");

        expect(res.status).toBe(404);
      });
    });
  });

  //Parte 2 POST

  //erro 201

  describe("POST /produtos", () => {
    test("Deve retornar 201 e o produto criado com id gerado", async () => {
      const novoProduto = { nome: "Suco de Laranja", preco: 7 };

      const res = await request(app)
        .post("/produtos")
        .send(novoProduto);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.nome).toBe(novoProduto.nome);
      expect(res.body.preco).toBe(novoProduto.preco);
    });

    // Deve retornar 400 com { erro: ... } quando o nome estiver faltando

    test("Deve retornar 400 com { erro: ... } quando o nome estiver faltando", async () => {
      const res = await request(app)
        .post("/produtos")
        .send({ preco: 7 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("erro");
    });

    //Deve retornar 400 com { erro: ... } quando o preco estiver faltando

    test("Deve retornar 400 com { erro: ... } quando o preco estiver faltando", async () => {
      const res = await request(app)
        .post("/produtos")
        .send({ nome: "Suco de Laranja" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("erro");
    });

    //O produto criado deve aparecer em uma chamada seguinte a GET /produtos

    test("O produto criado deve aparecer em uma chamada seguinte a GET /produtos", async () => {
      const novoProduto = { nome: "Empada", preco: 6 };

      await request(app)
        .post("/produtos")
        .send(novoProduto);

      const resGet = await request(app).get("/produtos");

      expect(resGet.status).toBe(200);
      expect(resGet.body.length).toBe(4); // Era 3, agora deve ter 4
    });
  });

  //DELETE /produtos/:id

  //Deve retornar 204 quando o produto e removido com sucesso

  describe("DELETE /produtos/:id", () => {
    test("Deve retornar 204 quando o produto é removido com sucesso", async () => {
      const res = await request(app).delete("/produtos/1");

      expect(res.status).toBe(204);
    });

    // produto removido nao deve mais aparecer em GET /produtos/:id (deve retornar 404 )

    test("O produto removido não deve mais aparecer em GET /produtos/:id (deve retornar 404)", async () => {
      await request(app).delete("/produtos/1");

      const resGet = await request(app).get("/produtos/1");

      expect(resGet.status).toBe(404);
    });

    //Deve retornar 404 com { erro: ... } quando o produto nao existir

    test("Deve retornar 404 com { erro: ... } quando o produto não existir", async () => {
      const res = await request(app).delete("/produtos/999");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("erro");
    });
  });
}); 