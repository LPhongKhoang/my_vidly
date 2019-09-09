const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function() {
  // Setup connection to MongoDB
  const db = config.get("db"); 
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(() => winston.info(`Connected to ${db}...`));
};
