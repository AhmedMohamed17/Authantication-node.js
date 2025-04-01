const express = require("express");

const authRoute = express.Router();
const authController = require("../controllers/authController.js");

authRoute.route("/register").post(authController.register);
authRoute.route("/login").post(authController.login);
authRoute.route("/refresh").get(authController.refresh);
authRoute.route("/logout").post(authController.logout);

module.exports = authRoute;
