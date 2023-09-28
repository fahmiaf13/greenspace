const express = require("express");
const router = express.Router();
const reserveController = require("../controllers/reservationController");

router.get("/list-reservation", reserveController.listReservedParkingSpots);
router.post("/reservation", reserveController.reserveParkingSpot);
router.put("/verify-reservation", reserveController.verifyReservation);
router.delete("/reservation/:id", reserveController.cancelReservation);

module.exports = router;
