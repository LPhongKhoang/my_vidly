const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");

const router = express.Router();

// Create customer Schema
const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  phone: {
    type: String
  }
});

// Create customer model
const Customer = mongoose.model("Customer", customerSchema);

// Handle http request
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});


router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
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
  const { error } = validateCustomer(req.body);
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

// function validate input
function validateCustomer(customer) {
  const schema = {
    isGold: Joi.bool().required(),
    name: Joi.string().required(),
    phone: Joi.string().regex(/^\d{3,10}$/)
  };
  return Joi.validate(customer, schema);
}




module.exports = router;
