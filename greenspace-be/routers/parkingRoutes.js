const express = require("express");
const router = express.Router();
const parkingController = require("../controllers/parkingController");

router.get("/spot", parkingController.listParkingSpot);
router.get("/spot/:id", parkingController.detailParkingSpot);

module.exports = router;
