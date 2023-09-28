const { PrismaClient } = require("../prisma/generated/client");
const prisma = new PrismaClient();
const { isBefore, isAfter, addDays, parseISO } = require("date-fns");

const reserveParkingSpot = async (req, res) => {
  const { userId, spotId, startTime, endTime } = req.body;

  const parsedStartTime = parseISO(startTime);
  const parsedEndTime = parseISO(endTime);
  const maxReservationDate = addDays(parsedStartTime, 7);

  req.session.reservation = { startTime: parsedStartTime, endTime: parsedEndTime, userId: userId, spotId: spotId };
  try {
    if (!isBefore(parsedEndTime, parsedStartTime) && !isAfter(parsedEndTime, maxReservationDate)) {
      const isAvailable = await prisma.parkingSpot.findFirst({
        where: {
          id: spotId,
          available: true,
        },
      });

      if (!isAvailable) {
        return res.status(400).json({ message: "Parking spot has been filled" });
      }

      const reservation = await prisma.reservation.create({
        data: {
          userId: userId,
          spotId: spotId,
          startTime: parsedStartTime,
          endTime: parsedEndTime,
          status: "PENDING",
        },
      });

      await prisma.parkingSpot.update({
        where: { id: spotId },
        data: { available: false, dateTime: parsedEndTime },
      });

      res.status(201).json({ data: reservation, message: "Reservation successfully added" });
    } else {
      res.status(404).json({ error: "Invalid date. Make sure the date is not before now and not later than 7 days from now." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is broken" });
  }
};

const cancelReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (reservation.status !== "PENDING") {
      return res.status(400).json({ error: "Reservation already been canceled before" });
    }

    const canceledReservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status: "CANCEL" },
    });

    await prisma.parkingSpot.update({
      where: { id: canceledReservation.spotId },
      data: { available: true },
    });
    res.status(201).json({ message: "Reservation has been canceled" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is broken" });
  }
};

const listReservedParkingSpots = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        ParkingSpot: {
          select: {
            location: true,
          },
        },
      },
    });
    res.json({ data: reservations, message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something is broken" });
  }
};

const verifyReservation = async (req, res) => {
  const { status, reservationId, officerId } = req.body;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(reservationId) },
    });

    if (!reservation || reservation.status !== "PENDING") {
      return res.status(404).json({ message: "Reservation not found or already have been verified." });
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: Number(reservationId) },
      data: { status: status, officerId: officerId },
    });

    await prisma.parkingSpot.update({
      where: { id: Number(updatedReservation.spotId) },
      data: { available: true, dateTime: reservation.endTime },
    });

    res.json({ data: updatedReservation, message: "Sucessfully verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken" });
  }
};

module.exports = {
  reserveParkingSpot,
  cancelReservation,
  listReservedParkingSpots,
  verifyReservation,
};
