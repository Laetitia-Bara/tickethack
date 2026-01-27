const request = require("supertest");
const app = require("../app");

describe("GET /trips", () => {
  it("test valid query", async () => {
    const res = await request(app).get(
      "/trips?departure=Paris&arrival=Lyon&date=2026-01-27",
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    expect(Array.isArray(res.body.trips)).toBe(true);
  });
});
