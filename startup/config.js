const config = require("config");

module.exports = function() {
  if (process.env.NODE_ENV === "production") {
    // check if jwtSecretKey is set as variable enviroment or not
    if (!config.get("jwtSecretKey")) {
      throw new Error("FATAL ERROR: my_vidly_jwtSecretKey is not set"); // longpkprojwt@1
    }
    if (!config.get("dbUsername")) {
      throw new Error("FATAL ERROR: my_vidly_db_user_name is not set"); // longpkprojwt@1
    }
    if (!config.get("dbUserPassword")) {
      throw new Error("FATAL ERROR: my_vidly_db_user_password is not set"); // longpkprojwt@1
    }
  }
};
