const Joi = require("joi");
const express = require("express");
const app = express();

const genresRouter = require("./routes/genres");

// use middleware
app.use(express.json());
app.use("/api/genres", genresRouter);


// get PORT as environment variable or default
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));