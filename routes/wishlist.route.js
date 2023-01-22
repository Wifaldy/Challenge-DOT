const router = require("express").Router();
const Controller = require("../controllers/wishlist.controller");
const isAuth = require("../middlewares/isAuth");

router.get("/wishlists", isAuth, Controller.getWishlist);

router.post("/wishlist/:id", isAuth, Controller.postAddWishlist);

router.delete("/wishlist/:id", isAuth, Controller.deleteWishlist);

module.exports = router;
