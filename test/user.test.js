const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const bcrypt = require("bcryptjs");
const app = require("../index");

beforeEach(async () => {
  const hash = await bcrypt.hash("123", 12);
  await queryInterface.bulkInsert("Users", [
    {
      name: "test",
      email: "test@test.com",
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

afterEach(async () => {
  await queryInterface.bulkDelete(
    "Users",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
});

describe("POST /login", () => {
  it("Success", async () => {
    const res = await request(app).post("/login").send({
      email: "test@test.com",
      password: "123",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch("Login success");
    expect(res.body).toHaveProperty("token");
  });
  it("404", async () => {
    const res = await request(app).post("/login").send({
      email: "test2@test.com",
      password: "123",
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch("User not found");
  });
  it("401", async () => {
    const res = await request(app).post("/login").send({
      email: "test@test.com",
      password: "1234",
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch("Email / password is wrong");
  });
});

describe("POST /register", () => {
  it("Success", async () => {
    const res = await request(app).post("/register").send({
      name: "test2",
      email: "test2@test.com",
      birthdate: "2023-05-17",
      password1: "1234",
      password2: "1234",
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch("User has been created");
  });
  it("400 User already exist", async () => {
    const res = await request(app).post("/register").send({
      name: "test2",
      email: "test@test.com",
      birthdate: "2023-05-17",
      password1: "1234",
      password2: "1234",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("User already exist");
  });
  it("400 Password doesnt match", async () => {
    const res = await request(app).post("/register").send({
      name: "test2",
      email: "test2@test.com",
      birthdate: "2023-05-17",
      password1: "1234",
      password2: "12345",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("Password doesnt match");
  });
});
