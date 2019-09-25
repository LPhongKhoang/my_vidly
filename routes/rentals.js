const express = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middlerware/auth");
const admin = require("../middlerware/admin");

// Init Fawn with mongoose connect
Fawn.init(mongoose);

// Create Router
const router = express.Router();

// handle http request
router.get("/", auth, async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // const { customerId, movieId } = req.body
  // find customer
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");
  console.log("customer: ", customer.name);
  console.log("movie: ", movie.title);
  if (movie.numberInStock <= 0)
    return res.status(400).send("Movie not in stock");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try {
    Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();
    console.log("Transaction: {Save rental, Update movie } done.")
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something went wrong");
  }
});

// router.put("/:id", async (req, res) => {
//   // validate
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);
//   // update directly to DB
//   const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name});
//   // Check if no update action is executed
//   if (!genre)
//     return res.status(404).send("The genre with the given Id was not found");

//   res.send(genre);
// });

router.delete("/:id", [auth, admin], async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);
  if (!rental)
    return res.status(404).send("The rental with the given Id was not found");

  res.send(dailyRentalRate);
});

router.get("/:id", auth, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if(!rental) return res.status(404).send("The rental with the given Id was not found");
  res.send(rental);
});

module.exports = router;
