const express = require('express');
const Message = require('../model/message');
const router = express.Router();

router.post('/messages', async (req, res) => {
  try {
    const { senderId, message, roomId } = req.body;
    const newMessage = new Message({
      senderId,
      message,
      roomId
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/messages/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;