const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("./prisma/generated/client");
const router = require("./routers");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    credentials: true,
    origin: "https://greenspace-git-dev-fahmiaf13.vercel.app",
    optionsSuccessStatus: 200,
  })
);

app.use(function (req, res, next) {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "https://greenspace-git-dev-fahmiaf13.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(morgan("combined"));
router(app);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await prisma.$connect();
  console.log("Connected to database");
});
