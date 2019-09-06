module.exports = function(req, res, next) {
  // read isAdmin property from req.user
  const isAdmin = req.user.isAdmin;
  if(isAdmin === true) {
    next();
  }else{
    res.status(403).send("Access denied");
  }
}