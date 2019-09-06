const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function(req, res, next) {
  // read x-auth-token in header of request
  const token = req.header("x-auth-token");
  if(!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  // verify token
  try{
    const payload = jwt.verify(token, config.get("jwtSecretKey"));
    req.user = payload;
    // pass to the next http handler
    next();
  }catch(e){
    // if token is invalid => jwt.verify throw an exception
    return res.status(401).send("Access denied. Invalid token.");
  }


}