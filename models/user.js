const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Add methods to Schema ==> after that we can use as method of it's model
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      name: this.name,
      email: this.email
    },
    config.get("jwtSecretKey"),
    {
      expiresIn: "1h"
    }
  );
  return token;
};

// Create model
const User = mongoose.model("User", userSchema);

// function validate input
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
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

exports.User = User;
exports.validate = validateUser;
