const moment = require("moment");
const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/user");
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");

describe("Return Rentals", () => {
  let server, customerId, movieId, movie, rental, token;

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId().toHexString();
    movieId = mongoose.Types.ObjectId().toHexString();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "movie name test",
      dailyRentalRate: 2,
      numberInStock: 10,
      genre: {
        name: "genre1 test"
      }
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "customer name test",
        phone: "12345877"
      },
      movie: {
        _id: movieId,
        title: "movie name test",
        dailyRentalRate: 2
      }
    });

    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  const exec = async () => {  
      return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  }

  it("Should return 401 if token is invalid", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("Should return 400 if customerId is no provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("Should return 400 if movieId is no provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  
  it("Should return 404 if rental is not found", async () => {
    customerId = mongoose.Types.ObjectId().toHexString();
    movieId = mongoose.Types.ObjectId().toHexString();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("Should return 400 if rental is processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("Should return 200 if valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("Should set the return date if input is valid", async () => {
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diffTime = new Date() - rentalInDb.dateReturned;
    expect(diffTime).toBeLessThan(15*1000);
  });

  it("Should set the corrent rentalFee if input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(7*rental.movie.dailyRentalRate);
  });

  it("Should increase movie in stock if input is valid", async () => {
    
    await exec();
    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(11);
  });

  it("Should return rental if input is valid", async () => {
    
    const res = await exec();
    expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
      "customer",
      "movie",
      "dateOut",
      "dateReturned",
      "rentalFee"
    ]));
  });

});
