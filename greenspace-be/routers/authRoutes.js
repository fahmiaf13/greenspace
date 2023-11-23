const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const pilkadaController = require("../controllers/pilkadaController/authPilkadaController");
router.post("/login", pilkadaController.Login);

router.post("/login/user", authController.loginAsUser);
router.post("/login/officer", authController.loginAsOfficer);
router.post("/register", authController.register);

module.exports = router;
