const router = require("express").Router();
const Controller = require("../controllers/user.controller");

router.post("/register", Controller.postRegister);

router.post("/login", Controller.postLogin);

module.exports = router;
