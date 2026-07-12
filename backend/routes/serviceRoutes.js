const express = require("express");
const router = express.Router();
const {
  getServices,
  getServiceBySlug,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Admin routes (must come before /:slug to avoid route collision)
router.get("/admin/all", protect, getAllServicesAdmin);
router.post("/", protect, upload.single("image"), createService);
router.put("/:id", protect, upload.single("image"), updateService);
router.delete("/:id", protect, deleteService);
router.patch("/:id/toggle", protect, toggleServiceStatus);

// Public routes
router.get("/", getServices);
router.get("/:slug", getServiceBySlug);

module.exports = router;
