const express = require("express");
const router = express.Router();
const {
  getElectricians,
  getElectricianById,
  createElectrician,
  updateElectrician,
  deleteElectrician,
} = require("../controllers/electricianController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(protect); // all electrician routes are admin-only

router.get("/", getElectricians);
router.get("/:id", getElectricianById);
router.post("/", upload.single("photo"), createElectrician);
router.put("/:id", upload.single("photo"), updateElectrician);
router.delete("/:id", deleteElectrician);

module.exports = router;
