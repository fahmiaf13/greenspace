module.exports = (app) => {
  app.use("/", require("./homeRoutes"));
  app.use("/auth", require("./authRoutes"));
  app.use("/parking", require("./parkingRoutes"));
};
