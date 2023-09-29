const { PrismaClient } = require("../prisma/generated/client");
const prisma = new PrismaClient();

const userProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const userDetailProfile = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        reservations: {
          include: {
            ParkingSpot: {
              select: {
                location: true,
              },
            },
          },
        },
      },
    });

    if (!userDetailProfile) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    const formattedReservations = userDetailProfile.reservations.map((reservation) => ({
      id: reservation.id,
      userId: reservation.userId,
      spotId: reservation.spotId,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      location: reservation.ParkingSpot.location,
    }));

    const resUserProfile = {
      id: userDetailProfile.id,
      username: userDetailProfile.username,
      email: userDetailProfile.email,
      role: userDetailProfile.role,
      reservations: formattedReservations,
    };

    res.status(200).json({ data: resUserProfile, message: "Success", status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken", status: 500, error });
  }
};

module.exports = {
  userProfile,
};
