const express = require("express");
const { Customer, validate } = require("../models/customer");

// Create router
const router = express.Router();

// Handle http request
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});


router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  });
  customer = await customer.save(); // return new customer with _id
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  });
  if(!customer) return res.status(404).send("The customer with given id was not found");
  console.log("new customer: ", customer);
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if(!customer) return res.status(404).send("The customer with given id was not found");
  res.send(customer);
});


router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if(!customer) return res.status(404).send("The customer with given id was not found");
  res.send(customer);
});





module.exports = router;
