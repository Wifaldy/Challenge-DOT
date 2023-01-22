const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const bcrypt = require("bcryptjs");
const app = require("../index");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let token;

beforeEach(async () => {
  await queryInterface.bulkInsert("Movies", [
    {
      title: "Wednesday",
      genre: "Mystery",
      creator: "Goo Goo Muck",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Saturday",
      genre: "Drama",
      creator: "Katty Pary",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
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
  token = jwt.sign(
    {
      userId: 1,
      email: "test@test.com",
    },
    process.env.JWT_SECRET
  );
  await queryInterface.bulkInsert("Wishlists", [
    {
      userId: 1,
      movieId: 1,
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
  await queryInterface.bulkDelete(
    "Users",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
  await queryInterface.bulkDelete(
    "Wishlists",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
});

describe("GET /wishlists", () => {
  it("Success", async () => {
    const res = await request(app)
      .get("/user/wishlists")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("wishlist");
  });
  it("Authorize denied", async () => {
    const res = await request(app).get("/user/wishlists");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch("Authorization denied");
  });
  it("Invalid token", async () => {
    const res = await request(app)
      .get("/user/wishlists")
      .set("Authorization", `Bearer ${"ASDSAD"}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch("Invalid token");
  });
});

describe("POST /wishlist/:id", () => {
  it("Success", async () => {
    const res = await request(app)
      .post("/user/wishlist/2")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch("Wishlist has been created");
  });
  it("404", async () => {
    const res = await request(app)
      .post("/user/wishlist/3")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch("Movie not found");
  });
  it("400 Movie already exist in wishlist", async () => {
    const res = await request(app)
      .post("/user/wishlist/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("Movie already exist in wishlist");
  });
});

describe("DELETE /wishlist/:id", () => {
  it("Success", async () => {
    const res = await request(app)
      .delete("/user/wishlist/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("wishlist");
    expect(res.body.message).toMatch("Wishlist has been deleted");
  });
  it("Success", async () => {
    const res = await request(app)
      .delete("/user/wishlist/3")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch("Wishlist not found");
  });
});
