const express = require("express");
const { Genre, validate } = require("../models/genre");

// Create Router 
const router = express.Router();

// handle http request
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name
  });
  genre = await genre.save(); // return new genre with _id
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  // validate
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update directly to DB
  const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name});
  // Check if no update action is executed
  if (!genre)
    return res.status(404).send("The genre with the given Id was not found");

  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given Id was not found");

  res.send(genre);
});


router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if(!genre) return res.status(404).send("The genre with the given Id was not found");
  res.send(genre);
});


module.exports = router;
