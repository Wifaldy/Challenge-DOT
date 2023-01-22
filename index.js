const express = require("express");

const app = express();
const port = 3000;

const userRoute = require("./routes/user.route");
const movieRoute = require("./routes/movie.route");
const wishlistRoute = require("./routes/wishlist.route");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoute);
app.use(movieRoute);
app.use("/user", wishlistRoute);

app.use(errorHandler);

// app.listen(3000, () => {
//   console.log(`This app is running on port ${port} `);
// });

module.exports = app;
