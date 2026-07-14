const asyncHandler = require("express-async-handler");
const ContactMessage = require("../models/ContactMessage");

// @desc    Submit a contact message (public)
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  const { fullName, mobileNumber, email, subject, message } = req.body;

  if (!fullName || !mobileNumber || !subject || !message) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const contactMessage = await ContactMessage.create({
    fullName,
    mobileNumber,
    email: email || "",
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Your message has been sent successfully. We will contact you soon.",
    data: contactMessage,
  });
});

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private
const getContactMessages = asyncHandler(async (req, res) => {
  const { isRead } = req.query;
  const filter = {};
  if (isRead !== undefined) filter.isRead = isRead === "true";

  const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, data: messages });
});

// @desc    Mark contact message as read/unread
// @route   PATCH /api/contact/:id/read
// @access  Private
const toggleMessageRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  message.isRead = !message.isRead;
  await message.save();

  res.json({ success: true, data: message });
});

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private
const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  await message.deleteOne();
  res.json({ success: true, message: "Message deleted successfully" });
});

module.exports = {
  createContactMessage,
  getContactMessages,
  toggleMessageRead,
  deleteContactMessage,
};
