const express = require("express");
const { validate, Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middlerware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  
  const { error } = validate(req.body);
  if(error)
    return res.status(400).send(error.details[0].message);


  const rental = await Rental.lookUp(req.body.customerId, req.body.movieId);
  if(!rental)
    return res.status(404).send("No rental is found");

  if(rental.dateReturned)
    return res.status(400).send("The rental is already processed");

  rental.return();

  await rental.save();

  // Increase number in stock of movie
  await Movie.updateOne({_id: rental.movie._id}, {
    $inc: { numberInStock: 1}
  });

  res.send(rental);
});

module.exports = router;


