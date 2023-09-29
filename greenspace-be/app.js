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
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  // res.header("Content-Type", "application/json;charset=UTF-8");
  // res.header("Access-Control-Allow-Credentials", true);
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(morgan("combined"));
router(app);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await prisma.$connect();
  console.log("Connected to database");
});
