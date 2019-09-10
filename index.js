const winston = require("winston");
const express = require("express");
// Create app server
const app = express();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);


// get PORT as environment variable or default
const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Server started at port ${port}`));
module.exports = server;