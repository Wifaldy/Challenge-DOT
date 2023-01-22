const { Movie } = require("../models");

exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json({
      movies,
    });
  } catch (err) {
    next(err);
  }
};

exports.postAddMovie = async (req, res, next) => {
  try {
    const { title, genre, creator } = req.body;
    const createdMovie = await Movie.create({
      title,
      genre,
      creator,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({
      message: "Movie has been created",
      movie: createdMovie,
    });
  } catch (err) {
    next(err);
  }
};

exports.putUpdateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, genre, creator } = req.body;
    const movie = await Movie.findOne({
      where: {
        id,
      },
    });
    if (!movie) {
      throw {
        status: 404,
        message: "Movie not found",
      };
    }
    const updatedMovie = await Movie.update(
      {
        title,
        genre,
        creator,
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).json({
      movie: updatedMovie,
      message: "Movie has been updated",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findOne({
      where: {
        id,
      },
    });
    if (!movie) {
      throw {
        status: 404,
        message: "Movie not found",
      };
    }
    const deletedMovie = await Movie.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      movie: deletedMovie,
      message: "Movie has been deleted",
    });
  } catch (err) {
    next(err);
  }
};
