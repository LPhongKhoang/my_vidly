const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function() {
  // Setup connection to MongoDB
  let db = config.get("db");
  if(process.env.NODE_ENV === "production") {
    const dbUsername = config.get("dbUsername");
    const dbUserPassword = config.get("dbUserPassword");
    db = db.replace("<username>", dbUsername);
    db = db.replace("<password>", dbUserPassword);
  } 

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(() => winston.info(`Connected to ${db}...`));
};
