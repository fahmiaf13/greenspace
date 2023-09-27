const { PrismaClient } = require("../prisma/generated/client");
const prisma = new PrismaClient();

const listParkingSpot = async (req, res) => {
  try {
    const response = await prisma.parkingSpot.findMany();
    res.status(200).json({
      data: response
        .sort((a, b) => a.id - b.id)
        .map((item) => ({
          ...item,
          dateTime: "-",
        })),
      message: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
};

const detailParkingSpot = async (req, res) => {
  const { id } = req.params;

  try {
    const parkingSpot = await prisma.parkingSpot.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!parkingSpot) {
      return res.status(404).json({ message: "Parking spot not found" });
    }

    res.json(parkingSpot);
  } catch (error) {
    console.error("Error fetching parking spot details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  listParkingSpot,
  detailParkingSpot,
};
