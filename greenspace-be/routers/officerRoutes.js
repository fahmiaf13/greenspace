const express = require("express");
const router = express.Router();
const officerController = require("../controllers/officerController");

router.get("/officer/:id", officerController.officerDetail);

module.exports = router;
