const router = require("express").Router();
const Controller = require("../controllers/movie.controller");

router.get("/movies", Controller.getMovies);

router.post("/movie", Controller.postAddMovie);

router.put("/movie/:id", Controller.putUpdateMovie);

router.delete("/movie/:id", Controller.deleteMovie);

module.exports = router;
