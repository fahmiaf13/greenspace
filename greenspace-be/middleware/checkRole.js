const verifyRole = (req, res, next) => {
  const authCookie = req.cookies.auth;

  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      const role = authData.member.role;
      if (role === "USER") {
        next();
      } else if (role === "OFFICER") {
        next();
      } else {
        res.status(401).json({ message: "You doesn't have an authority", status: 401 });
      }
    } catch (error) {
      res.status(500).json({ message: "Something is broken", status: 500 });
    }
  } else {
    res.status(404).json({ message: "Cookies not found", status: 404 });
  }
};

const verifyOfficer = (req, res, next) => {
  const authCookie = req.cookies.auth;
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      const role = authData.member.role;
      if (role === "OFFICER") {
        next();
      } else {
        res.status(401).json({ message: "You doesn't have an authority", status: 401 });
      }
    } catch (error) {
      res.status(500).json({ message: "Something is broken", status: 500 });
    }
  } else {
    res.status(404).json({ message: "Cookies not found", status: 404 });
  }
};

const verifyOwner = (req, res, next) => {
  const authCookie = req.cookie.auth;

  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      const role = authData.member.role;
      if (role === "OWNER") {
        next();
      } else {
        res.status(401).json({ message: "You doesn't have an authority", status: 401 });
      }
    } catch (error) {
      res.status(500).json({ message: "Something is broken", status: 500 });
    }
  } else {
    res.status(404).json({ message: "Cookies not found", status: 404 });
  }
};

const verifyAdmin = (req, res, next) => {
  const authCookie = req.cookie.auth;
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      const role = authData.member.role;
      if (role === "ADMIN") {
        next();
      } else {
        res.status(401).json({ message: "You doesn't have an authority", status: 401 });
      }
    } catch (error) {
      res.status(500).json({ message: "Something is broken", status: 500 });
    }
  } else {
    res.status(404).json({ message: "Cookies not found", status: 404 });
  }
};
const verifyRelawan = (req, res, next) => {
  const authCookie = req.cookie.auth;
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      const role = authData.member.role;
      if (role === "RELAWAN") {
        next();
      } else {
        res.status(401).json({ message: "You doesn't have an authority", status: 401 });
      }
    } catch (error) {
      res.status(500).json({ message: "Something is broken", status: 500 });
    }
  } else {
    res.status(404).json({ message: "Cookies not found", status: 404 });
  }
};

const verifyUser = (req, res, next) => {
  const authCookie = req.cookies.auth;

  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      const role = authData.member.role;
      if (role === "USER") {
        next();
      } else {
        res.status(401).json({ message: "You doesn't have an authority", status: 401 });
      }
    } catch (error) {
      res.status(500).json({ message: "Something is broken", status: 500 });
    }
  } else {
    res.status(404).json({ message: "Cookies not found", status: 404 });
  }
};

module.exports = {
  verifyRole,
  verifyOfficer,
  verifyUser,
  verifyOwner,
  verifyAdmin,
  verifyRelawan,
};
