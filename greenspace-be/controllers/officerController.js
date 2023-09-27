const { PrismaClient } = require("../prisma/generated/client");
const prisma = new PrismaClient();

const officerDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const officer = await prisma.officer.findUnique({
      where: { id: id },
    });
    if (!officer) {
      return res.status(404).json({ message: "Officer not found" });
    }
    res.json({ data: officer, message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Something is broken" });
  }
};

module.exports = {
  officerDetail,
};
