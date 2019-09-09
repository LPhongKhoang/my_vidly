const express = require("express");
const mongoose = require("mongoose");
const { Genre, validate } = require("../models/genre");
const auth = require("../middlerware/auth");
const admin = require("../middlerware/admin");
const validateObjectId = require("../middlerware/validateObjectId");

// Create Router 
const router = express.Router();

// handle http request
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name
  });
  await genre.save();
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

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given Id was not found");

  res.send(genre);
});


router.get("/:id", validateObjectId, async (req, res) => {
  
  const genre = await Genre.findById(req.params.id);
  if(!genre) return res.status(404).send("The genre with the given Id was not found");
  res.send(genre);
});


module.exports = router;
