const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const { User } = require("../models/user");

// Create Router 
const router = express.Router();

// handle http request
router.post("/", async (req, res) => {
  // validate request's body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check email
  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send("Invalid email or password");
  // check password
  const validatePass = await bcrypt.compare(req.body.password, user.password);
  if(!validatePass) return res.status(400).send("Invalid email or password");

  // Generate json web token for sending back to client 
  const token = user.generateAuthToken();
  res.send({
    token
  });
});

// function validate input
function validate(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}



module.exports = router;
