const { PrismaClient } = require("../prisma/generated/client");
const prisma = new PrismaClient();
const { format } = require("date-fns");
const listParkingSpot = async (req, res) => {
  try {
    const response = await prisma.parkingSpot.findMany();
    res.status(200).json({
      data: response
        .sort((a, b) => a.id - b.id)
        .map((item) => ({
          ...item,
          dateTime: item.dateTime ? format(item.dateTime, "dd-mm-yyyy") : "-",
        })),
      message: "Success",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken", status: 500 });
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
      return res.status(404).json({ message: "Parking spot not found", status: 404 });
    }

    res.status(200).json({ data: parkingSpot, message: "Success", status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken", status: 500 });
  }
};

module.exports = {
  listParkingSpot,
  detailParkingSpot,
};
