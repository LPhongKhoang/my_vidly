const express = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

// Create Router 
const router = express.Router();

// handle http request
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { title, genreId, numberInStock, dailyRentalRate } = req.body;

  const genre = await Genre.findById(genreId);
  if(!genre) return res.status(400).send("Invalid genre");

  let movie = new Movie({
    title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock,
    dailyRentalRate
  });
  movie = await movie.save(); // return new movie with _id
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  // validate
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // find genre with genreId
  const genre = await Genre.findById(req.body.genreId).select("name");
  if (!genre) return res.status(400).send("Invalid genre");

  // update directly to DB
  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre: {
      _id: req.body.genreId,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate

  }, (_, res) => console.log("update movie done: res = ", res)); // if we pass callback ==> movie is data just updated. Otherwise, it's old one.
  // Check if no update action is executed
  if (!movie)
    return res.status(404).send("The movie with the given Id was not found");

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with the given Id was not found");

  res.send(movie);
});


router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if(!movie) return res.status(404).send("The movie with the given Id was not found");
  res.send(movie);
});


module.exports = router;
