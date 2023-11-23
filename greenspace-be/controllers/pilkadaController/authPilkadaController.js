const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../../prisma/generated/client");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const LoginAsOwner = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await prisma.owner.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password", status: 401 });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password", status: 401 });
    }

    const generatedToken = __generateToken(user);

    res.status(200).json({ data: user, token: generatedToken, message: "Success", status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken", status: 500, error });
  }
};

const LoginAsAdmin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const officer = await prisma.admin.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!officer) {
      return res.status(401).json({ message: "Incorrect email or password", status: 401 });
    }
    const passwordMatch = await bcrypt.compare(password, officer.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect email or password", status: 401 });
    }
    const generatedToken = __generateToken(officer);
    res.status(200).json({ data: officer, token: generatedToken, message: "Success", status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken", status: 500, error });
  }
};

const LoginAsRelawan = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const officer = await prisma.relawan.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!officer) {
      return res.status(401).json({ message: "Incorrect email or password", status: 401 });
    }
    const passwordMatch = await bcrypt.compare(password, officer.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect email or password", status: 401 });
    }
    const generatedToken = __generateToken(officer);
    res.status(200).json({ data: officer, token: generatedToken, message: "Success", status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken", status: 500, error });
  }
};
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan username dan role
    const owner = await prisma.owner.findUnique({ where: { email } });
    const relawan = await prisma.relawan.findUnique({ where: { email } });
    const admin = await prisma.admin.findUnique({ where: { email } });
    const user = owner || relawan || admin;

    if (!user) {
      return res.status(401).json({ message: "Incorrect email", status: 401 });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect  password", status: 401 });
    }
    const generatedToken = __generateToken(user);
    res.status(200).json({ data: user, token: generatedToken, message: "Success", status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something is broken", status: 500, error });
  }
};

// const register = async (req, res) => {
//   if (req.body.role === "USER") {
//     try {
//       const { username, email, password, role } = req.body;

//       const existingUser = await prisma.user.findFirst({
//         where: {
//           OR: [{ email }, { username }],
//         },
//       });

//       if (existingUser) {
//         return res.status(400).json({ message: "Email or username has been registered", status: 400 });
//       }
//       const hashedPassword = await bcrypt.hash(password, 10);

//       const user = await prisma.user.create({
//         data: {
//           username,
//           email,
//           password: hashedPassword,
//           role,
//         },
//       });

//       const resRegistration = {
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       };

//       res.status(201).json({
//         message: "Registration successful",
//         data: resRegistration,
//         status: 201,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Something is broken", status: 500, error });
//     }
//   } else if (req.body.role === "OFFICER") {
//     try {
//       const { username, email, password, role } = req.body;
//       const existingOfficer = await prisma.officer.findFirst({
//         where: {
//           OR: [{ email }, { username }],
//         },
//       });

//       if (existingOfficer) {
//         return res.status(400).json({ message: "Email or username has already been registered", status: 400 });
//       }
//       const hashedPassword = await bcrypt.hash(password, 10);

//       const user = await prisma.officer.create({
//         data: {
//           username,
//           email,
//           password: hashedPassword,
//           role,
//         },
//       });

//       res.status(201).json({
//         status: 201,
//         message: "Registration successful",
//         data: {
//           username: user.username,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Something is broken", status: 500, error });
//     }
//   } else {
//     res.status(400).json({ message: "Invalid role, register is failed!", status: 400 });
//   }
// };

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
  LoginAsAdmin,
  LoginAsOwner,
  LoginAsRelawan,
  Login,
};
