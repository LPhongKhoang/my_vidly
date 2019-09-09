const mongoose = require("mongoose");

module.exports = function(req, res, next) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return res.status(404).send("The genre with the given Id was not found");
  }

  next();
}