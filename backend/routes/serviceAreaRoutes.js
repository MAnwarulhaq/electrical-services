const express = require("express");
const router = express.Router();
const {
  getServiceAreas,
  getAllServiceAreasAdmin,
  createServiceArea,
  updateServiceArea,
  deleteServiceArea,
} = require("../controllers/serviceAreaController");
const { protect } = require("../middleware/authMiddleware");

router.get("/admin/all", protect, getAllServiceAreasAdmin);
router.post("/", protect, createServiceArea);
router.put("/:id", protect, updateServiceArea);
router.delete("/:id", protect, deleteServiceArea);

router.get("/", getServiceAreas);

module.exports = router;
