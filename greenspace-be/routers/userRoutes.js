const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkRole = require("../middleware/checkRole");

router.get("/user/:id", checkRole.verifyUser, userController.userProfile);

module.exports = router;
