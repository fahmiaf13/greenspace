const express = require("express");
const router = express.Router();
const officerController = require("../controllers/officerController");
const checkRole = require("../middleware/checkRole");

router.get("/officer/:id", checkRole.verifyOfficer, officerController.officerDetail);

module.exports = router;
