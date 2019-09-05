const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");

// Create app server
const app = express();

// Routers
const genresRouter = require("./routes/genres");
const customesRouter = require("./routes/customers");
const movieRouter = require("./routes/movies");
const rentalRouter = require("./routes/rentals");
// Setup connection to MongoDB
mongoose.connect('mongodb://localhost/my_vidly', {
  useNewUrlParser: true,
  useFindAndModify: false
})
  .then(() => console.log("Connected to MongoDb..."))
  .catch(err => console.error("Could not connect to MongoDb..."));


// use middleware
app.use(express.json());
app.use("/api/genres", genresRouter);
app.use("/api/customers", customesRouter);
app.use("/api/movies", movieRouter);
app.use("/api/rentals", rentalRouter);


// get PORT as environment variable or default
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));