const { PrismaClient } = require("../prisma/generated/client");
const prisma = new PrismaClient();
const { isBefore, isAfter, addDays, parseISO } = require("date-fns");

const reserveParkingSpot = async (req, res) => {
  const { userId, spotId, startTime, endTime } = req.body;

  const parsedStartTime = parseISO(startTime);
  const parsedEndTime = parseISO(endTime);
  const maxReservationDate = addDays(parsedStartTime, 7);

  try {
    if (!isBefore(parsedEndTime, parsedStartTime) && !isAfter(parsedEndTime, maxReservationDate)) {
      const isAvailable = await prisma.parkingSpot.findFirst({
        where: {
          id: spotId,
          available: true,
        },
      });

      if (!isAvailable) {
        return res.status(400).json({ message: "Parking spot has been filled", status: 400 });
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

      res.status(200).json({ data: reservation, message: "Reservation successfully added", status: 200 });
    } else {
      res.status(404).json({ message: "Invalid date. Make sure the date is not before now and not later than 7 days from now.", status: 404 });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is broken", status: 500 });
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
      return res.status(404).json({ message: "Reservation not found", status: 404 });
    }

    if (reservation.status !== "PENDING") {
      return res.status(400).json({ message: "Reservation already been canceled before", status: 400 });
    }

    const canceledReservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status: "CANCEL" },
    });

    await prisma.parkingSpot.update({
      where: { id: canceledReservation.spotId },
      data: { available: true },
    });
    res.status(200).json({ message: "Reservation has been canceled", status: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is broken", status: 500 });
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
    res.status(200).json({ data: reservations, message: "Success", status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken", status: 500, error });
  }
};

const verifyReservation = async (req, res) => {
  const { status, reservationId, officerId } = req.body;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(reservationId) },
    });

    if (!reservation || reservation.status !== "PENDING") {
      return res.status(404).json({ message: "Reservation not found or already have been verified.", status: 404 });
    }

    if (status === "APPROVE") {
      const updatedReservation = await prisma.reservation.update({
        where: { id: Number(reservationId) },
        data: { status: status, officerId: officerId },
      });

      await prisma.parkingSpot.update({
        where: { id: Number(updatedReservation.spotId) },
        data: { available: false, dateTime: reservation.endTime },
      });

      res.status(200).json({ data: updatedReservation, message: "Reservation approved", status: 200 });
    } else if (status === "REJECT") {
      const updatedReservation = await prisma.reservation.update({
        where: { id: Number(reservationId) },
        data: { status: status, officerId: officerId },
      });

      await prisma.parkingSpot.update({
        where: { id: Number(updatedReservation.spotId) },
        data: { available: true, dateTime: null },
      });

      res.status(200).json({ data: updatedReservation, message: "Reservation rejected", status: 200 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken", status: 500, error });
  }
};

module.exports = {
  reserveParkingSpot,
  cancelReservation,
  listReservedParkingSpots,
  verifyReservation,
};
