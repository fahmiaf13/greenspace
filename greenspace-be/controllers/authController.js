const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("../prisma/generated/client");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const loginAsUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const generatedToken = __generateToken(user);

    res.status(200).json({ data: user, token: generatedToken, message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken" });
  }
};

const loginAsOfficer = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const officer = await prisma.officer.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!officer) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, officer.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    const generatedToken = __generateToken(officer);
    res.status(200).json({ data: officer, token: generatedToken, msg: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken" });
  }
};

const register = async (req, res) => {
  if (req.body.role === "USER") {
    try {
      const { username, email, password, role } = req.body;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email or username has been registered" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role,
        },
      });

      const resRegistration = {
        username: user.username,
        email: user.email,
        role: user.role,
      };

      res.status(201).json({
        message: "Registration successful",
        data: resRegistration,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something is broken" });
    }
  } else if (req.body.role === "OFFICER") {
    try {
      const { username, email, password, role } = req.body;
      const existingOfficer = await prisma.officer.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingOfficer) {
        return res.status(400).json({ message: "Email or username has already been registered" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.officer.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role,
        },
      });

      res.status(201).json({
        status: 201,
        message: "Registration successful",
        data: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal mendaftar" });
    }
  } else {
    res.json({ message: "Invalid role, register is failed!" });
  }
};

const __generateToken = (user) => {
  const payload = {
    username: user.username,
  };

  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

module.exports = {
  loginAsOfficer,
  loginAsUser,
  register,
};
