function verifyRole(req, res, next) {
  const authCookie = req.cookies.auth;

  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      const role = authData.user.role;
      if (role === "USER") {
        next();
      } else if (role === "OFFICER") {
        next();
      } else {
        res.json({ message: "Anda tidak memiliki otoritas mengakses" });
      }
    } catch (error) {
      res.status(500).json({ message: "Gagal mengurai cookie." });
    }
  } else {
    res.status(404).json("Cookie tidak ditemukan.");
  }
}

module.exports = {
  verifyRole,
};
