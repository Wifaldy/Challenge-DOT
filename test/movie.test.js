const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const app = require("../index");

beforeEach(async () => {
  await queryInterface.bulkInsert("Movies", [
    {
      title: "Wednesday",
      genre: "Mystery",
      creator: "Goo Goo Muck",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

afterEach(async () => {
  await queryInterface.bulkDelete(
    "Movies",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
});

describe("GET /movies", () => {
  it("Success", async () => {
    const res = await request(app).get("/movies");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("movies");
  });
});

describe("POST /movie", () => {
  it("Success", async () => {
    const res = await request(app).post("/movie").send({
      title: "Amsterdam",
      genre: "Myster",
      creator: "Taylor Swift",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("movie");
    expect(res.body.message).toMatch("Movie has been created");
  });
});

describe("PUT /movie/:id", () => {
  it("Success", async () => {
    const res = await request(app).put("/movie/1").send({
      title: "Wednesdam",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("movie");
    expect(res.body.message).toMatch("Movie has been updated");
  });
  it("404", async () => {
    const res = await request(app).put("/movie/2").send({
      title: "Wednesdam",
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch("Movie not found");
  });
});

describe("DELETE /movie/:id", () => {
  it("Success", async () => {
    const res = await request(app).delete("/movie/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch("Movie has been deleted");
  });
  it("404", async () => {
    const res = await request(app).delete("/movie/2");
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch("Movie not found");
  });
});
