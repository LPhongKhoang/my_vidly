
const express = require("express");
// Routers
const genresRouter = require("../routes/genres");
const customesRouter = require("../routes/customers");
const movieRouter = require("../routes/movies");
const rentalRouter = require("../routes/rentals");
const userRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const returnRouter = require("../routes/returns");
const error = require("../middlerware/error");

module.exports = function(app) {
  // use middleware
  app.use(express.json());
  app.use("/api/genres", genresRouter);
  app.use("/api/customers", customesRouter);
  app.use("/api/movies", movieRouter);
  app.use("/api/rentals", rentalRouter);
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/returns", returnRouter);
  app.use(error);
}