const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController.js");
const verifyJWT = require("../middleware/verifyJWT.js");

router.use(verifyJWT);
router.route("/").get(userController.getAllUsers);

module.exports = router;
