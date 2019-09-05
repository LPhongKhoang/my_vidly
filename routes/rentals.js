const express = require("express");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");

// Create Router 
const router = express.Router();

// handle http request
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // const { customerId, movieId } = req.body
  // find customer
  const customer = Customer.findById(req.body.customerId);
  if(!customer) return res.status(400).send("Invalid customer");

  const movie = Custtomer.findById(req.body.movieId);
  if(!movie) return res.status(400).send("Invalid movie");
  if(movie.numberInStock <= 0) return res.status(400).send("Movie not in stock");

  let rental = new Rental({
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

  // save1: rental
  rental = await rental.save();
  // update numberInStock of movie
  movie.numberInStock -= 1; 
  // save2: movie
  movie.save();

  res.send(rental);
  
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

// router.delete("/:id", async (req, res) => {
//   const genre = await Genre.findByIdAndRemove(req.params.id);
//   if (!genre)
//     return res.status(404).send("The genre with the given Id was not found");

//   res.send(genre);
// });


// router.get("/:id", async (req, res) => {
//   const genre = await Genre.findById(req.params.id);
//   if(!genre) return res.status(404).send("The genre with the given Id was not found");
//   res.send(genre);
// });


module.exports = router;
