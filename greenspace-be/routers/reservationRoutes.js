const express = require("express");
const router = express.Router();
const reserveController = require("../controllers/reservationController");
const checkRole = require("../middleware/checkRole");

router.get("/list-reservation", checkRole.verifyOfficer, reserveController.listReservedParkingSpots);
router.post("/reservation", checkRole.verifyUser, reserveController.reserveParkingSpot);
router.put("/verify-reservation", checkRole.verifyOfficer, reserveController.verifyReservation);
router.delete("/reservation/:id", checkRole.verifyUser, reserveController.cancelReservation);

module.exports = router;
