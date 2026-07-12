const express = require("express");
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
  toggleMessageRead,
  deleteContactMessage,
} = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", createContactMessage);

router.get("/", protect, getContactMessages);
router.patch("/:id/read", protect, toggleMessageRead);
router.delete("/:id", protect, deleteContactMessage);

module.exports = router;
