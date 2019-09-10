const config = require("config");

module.exports = function() {
  // check if jwtSecretKey is set as variable enviroment or not
  if (!config.get("jwtSecretKey")) {
    throw new Error("FATAL ERROR: my_vidly_jwtSecretKey is not set"); // longpkprojwt@1
  }
  if(process.env.NODE_ENV === "production") {
    if (!config.get("my_vildy_db_user_name")) {
      throw new Error("FATAL ERROR: my_vidly_db_user_name is not set"); // longpkprojwt@1
    }
    if (!config.get("my_vidly_db_user_password")) {
      throw new Error("FATAL ERROR: my_vidly_db_user_password is not set"); // longpkprojwt@1
    }
  }
  
};
