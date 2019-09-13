
const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");

module.exports = function() {
  // // Subscribe to "uncaughtException" event: Exception in synchronous
  // process.on("uncaughtException", (ex)=>{
  //   console.log("LONGPK: Uncaught Exception");
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });
  // // Subscribe to "uncaughtException" event: Exception in asynchronous
  // process.on("unhandledRejection", (ex)=>{
  //   console.log("LONGPK: Unhandle Rejection");
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });

  //======== We can try alternative approach using winston ========
  // this will catch "uncaughtException" (like process above) and automatically stop whole app (process.exit(1))
  winston.handleExceptions(
    new winston.transports.File({ filename: "uncaughtException.log" })
  );
  // Subscribe to "uncaughtException" event: Exception in asynchronous
  process.on("unhandledRejection", ex => {
    throw ex; // this will throw an exception. This help winston.handleException catch this exception
  });

  // Add transport File, DB for logging
  winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, {
  //   db: "mongodb://localhost/my_vidly",
  //   level: "warn"
  // });
};
