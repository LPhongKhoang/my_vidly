const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");

let server;

describe("Auth middleware", () => {
  
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  let token;
  beforeEach(()=>{
    token = new User().generateAuthToken();
  })

  it("should return 401 status in no token provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 status if invalid token", async () => {
    token = "abc";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 status if valid token", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
