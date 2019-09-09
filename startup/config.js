const config = require("config");

module.exports = function() {
  // check if jwtSecretKey is set as variable enviroment or not
  if (!config.get("jwtSecretKey")) {
    throw new Error("FATAL ERROR: my_vidly_jwtSecretKey is not set"); // longpkprojwt@1
  }
};
