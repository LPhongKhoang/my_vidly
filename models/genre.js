const mongoose = require("mongoose");
const Joi = require("joi");
// Define Schemases
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});


// Create real class from Schemas 
const Genre = mongoose.model("Genre", genreSchema);

// function validate input
function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;