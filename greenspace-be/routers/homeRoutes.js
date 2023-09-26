const express = require("express");
const router = express.Router();

router.get("/", async function (req, res) {
  res.status(200).send("Hello world!");
});

module.exports = router;
