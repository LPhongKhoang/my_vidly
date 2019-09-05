const mongoose = require("mongoose");
const Joi = require("joi");
// Create customer Schema
const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

// Create customer model
const Customer = mongoose.model("Customer", customerSchema);


// function validate input
function validateCustomer(customer) {
  const schema = {
    isGold: Joi.bool().required(),
    name: Joi.string().required(),
    phone: Joi.string().regex(/^\d{3,10}$/)
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
