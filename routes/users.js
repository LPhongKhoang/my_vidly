const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const { User, validate } = require("../models/user");
const auth = require("../middlerware/auth");

// Create Router 
const router = express.Router();

// handle http request
router.get("/me", auth, async (req, res) => {
  // auth middlerware will check and if it comes here ==> req.user has payload of token
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
})


router.post("/", async (req, res) => {
  // validate request's body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check user with email is exist before
  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send("User with given email is already exist");
  // create new user
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  // Hasing password of user
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  // Generate json web token
  const token = user.generateAuthToken();

  await user.save();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]));
});



module.exports = router;
