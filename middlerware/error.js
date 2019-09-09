const winston = require("winston");

module.exports = function(err, req, res, next) {
  winston.error(err.message, err);
  // Level log (prority: hight to low)
  /*
    error
    warn
    info
    verbose
    debug
    silly

  */
  res.status(500).send("Something went wrong");
}