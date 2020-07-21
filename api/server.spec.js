const supertest = require("supertest");
const server = require("./server.js");
const db = require("../database/dbConfig.js");

beforeEach(async () => {
  await db.seed.run();
});

describe("server.js", () => {
  it("should set the testing environment", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
  describe("POST /api/auth/register", () => {
    it("should return 201 created on successful post", async () => {
      let newUser = { username: "Michael", password: "password" };
      const res = await supertest(server)
        .post("/api/auth/register")
        .send(newUser);
      expect(res.status).toBe(201);
    });

    it("should return 400 when missing username and/or password", async () => {
      let newUser1 = { password: "password" };
      let newUser2 = { username: "George" };
      let newUser3 = {};

      const res1 = await supertest(server)
        .post("/api/auth/register")
        .send(newUser1);
      expect(res1.status).toBe(400);

      const res2 = await supertest(server)
        .post("/api/auth/register")
        .send(newUser2);
      expect(res2.status).toBe(400);

      const res3 = await supertest(server)
        .post("/api/auth/register")
        .send(newUser3);
      expect(res3.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 200 OK on successful post", async () => {
      // create user
      let newUser = { username: "Michael", password: "password" };
      const res1 = await supertest(server)
        .post("/api/auth/register")
        .send(newUser);

      // login new user
      const res2 = await supertest(server)
        .post("/api/auth/login")
        .send(newUser);

      expect(res2.status).toBe(200);
    });
    it("should return 400 on Invalid username and password", async () => {
      let user = { username: "charles", password: "1234" };

      const res = await supertest(server)
        .post("/api/auth/login")
        .send(user);

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/jokes", () => {
    it("should return 200 on authorized user", async () => {
      let user = { username: "Michael", password: "password" };
      const res1 = await supertest(server)
        .post("/api/auth/register")
        .send(user);

      const res2 = await supertest(server)
        .post("/api/auth/login")
        .send(user);

      const res3 = await supertest(server)
        .get("/api/jokes")
        .set("Authorization", res2.body.token);

      expect(res3.status).toBe(200);
    }, 10000);

    it("should return 401 on unauthorized user", async () => {
      const res = await supertest(server).get("/api/jokes");
      expect(res.status).toBe(401);
    });
  });
});
