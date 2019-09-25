const express = require("express");
const { Customer, validate } = require("../models/customer");
const auth = require("../middlerware/auth");
const admin = require("../middlerware/admin");

// Create router
const router = express.Router();

// Handle http request
router.get("/", auth,async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});


router.post("/", [auth, admin],async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  }); // ==> objectId (_id) is actually created here
  await customer.save();
  res.send(customer);
});

router.put("/:id", [auth, admin], async (req, res) => {
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

router.delete("/:id", [auth, admin], async (req, res) => {
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
