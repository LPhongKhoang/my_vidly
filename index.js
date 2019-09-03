const mongoose = require("mongoose");
const express = require("express");
const app = express();

const genresRouter = require("./routes/genres");

// Setup connection to MongoDB
mongoose.connect('mongodb://localhost/my_vidly', {
  useNewUrlParser: true,
  useFindAndModify: false
})
  .then(() => console.log("Connected to MongoDb..."))
  .catch(err => console.error("Could not connect to MongoDb..."));


// use middleware
app.use(express.json());
app.use("/api/genres", genresRouter);


// get PORT as environment variable or default
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));