const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");

// Protect admin routes - verifies JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin || !req.admin.isActive) {
        res.status(401);
        throw new Error("Not authorized, admin account inactive or not found");
      }

      return next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed or expired");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

// Restrict to superadmin only
const superAdminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === "superadmin") {
    return next();
  }
  res.status(403);
  throw new Error("Not authorized, superadmin access required");
};

module.exports = { protect, superAdminOnly };
