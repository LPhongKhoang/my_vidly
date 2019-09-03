const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
// Define Schemases
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});


// Create real class from Schemas 
const Genre = mongoose.model("Genre", genreSchema);

// handle http request
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name
  });
  genre = await genre.save(); // return new genre with _id
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  // validate
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update directly to DB
  const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
    new: true
  });
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

// function validate input
function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(genre, schema);
}

module.exports = router;
