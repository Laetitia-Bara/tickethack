const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let app;

const Trip = require("../models/trips");

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();

  // On connecte mongoose à la DB mémoire
  await mongoose.connect(process.env.MONGO_URI);

  app = require("../app");
});

afterEach(async () => {
  await Trip.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close(true);
  await mongoServer.stop();
});

describe("GET /trips", () => {
  it("test valid query", async () => {
    await Trip.create({
      departure: "Paris",
      arrival: "Lyon",
      date: new Date("2026-01-27T10:00:00Z"),
      price: 38,
    });

    const res = await request(app).get(
      "/trips?departure=Paris&arrival=Lyon&date=2026-01-27",
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    expect(Array.isArray(res.body.trips)).toBe(true);
    expect(res.body.trips.length).toBeGreaterThan(0);
  });
});
