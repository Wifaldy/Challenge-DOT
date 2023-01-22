const { Movie, Wishlist } = require("../models");

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findAll({
      include: [
        {
          model: Movie,
          attributes: ["title", "genre", "creator"],
        },
      ],
      where: {
        userId: req.user.userId,
      },
    });
    res.status(200).json({
      wishlist,
    });
  } catch (err) {
    next(err);
  }
};

exports.postAddWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw {
        status: 404,
        message: "Movie not found",
      };
    }
    const isWishlistExist = await Wishlist.findOne({
      where: {
        userId: req.user.userId,
        movieId: movie.id,
      },
    });
    if (isWishlistExist) {
      throw {
        status: 400,
        message: "Movie already exist in wishlist",
      };
    }
    const createdWishlist = await Wishlist.create({
      userId: req.user.userId,
      movieId: movie.id,
    });
    res.status(201).json({
      wishlist: createdWishlist,
      message: "Wishlist has been created",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const wishlist = await Wishlist.findOne({
      where: {
        id,
      },
    });
    if (!wishlist) {
      throw {
        status: 404,
        message: "Wishlist not found",
      };
    }
    const deletedWishlist = await Wishlist.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      wishlist: deletedWishlist,
      message: "Wishlist has been deleted",
    });
  } catch (err) {
    next(err);
  }
};
