const express = require("express");
const axios = require("axios");
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require("../models/Message");

// Lấy lịch sử chat với pagination
router.get("/history", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ user: req.user })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ user: req.user });

    res.json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMessages: total,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve chat history" });
  }
});

// Gửi tin nhắn và nhận phản hồi từ ChatGPT
router.post("/message", auth, async (req, res) => {
  try {
    const { content } = req.body;

    const userMessage = new Message({
      user: req.user,
      content,
      isBot: false,
    });
    await userMessage.save();

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const botReply = response.data.choices[0].message.content;

    const botMessage = new Message({
      user: req.user,
      content: botReply,
      isBot: true,
    });
    await botMessage.save();

    res.json({
      userMessage,
      botMessage,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process message" });
  }
});

module.exports = router;
