const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;

describe("/api/genres", () => {
  // load new state
  beforeEach(() => {
    server = require("../../index");
  });
  // clear state after each test
  afterEach( async () => {
    await server.close();
    await Genre.deleteMany({});
  });

  describe("Get /", () => {
    it("should return all genres", async () => {
      // insert some data
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
      expect(res.body.some(g => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("Get /:id", () => {
    it("should return status 404 if genreId not found", async () => {
      // // can use this to test: or validate object id in this route to be easier when pass ObjectId in testing
      // // create new ObjectId
      // const fakeObjectId = new mongoose.Types.ObjectId().toHexString();

      const res = await request(server).get(`/api/genres/134a33`);
      expect(res.status).toBe(404);
    });

    it("should return genre with valid genreId", async () => {
      const newGenre = new Genre({
        name: "genre1"
      });
      await newGenre.save();

      const res = await request(server).get(`/api/genres/${newGenre._id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("genre1");
    });
  });

  describe("Post /", () => {
    let token, name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(()=>{
      token = new User().generateAuthToken();
      name = "genre1";
    });


    it("Should return 401 status if not valid token is passed", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("Should return 400 status if genre's name less than 5 chars", async () => {
      name = "abcd";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("Should return 400 status if genre's name greater than 50 chars", async () => {
      
      name = Array(51).fill('a').join("");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("Should save genre if genre is valid", async () => {
      await exec();
      const genre = await Genre.findOne({name: "genre1"});
      expect(genre).not.toBeNull();
    });

    it("Should send genre if genre is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
