const express = require('express');
const Chat = require('../models/Chat');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// Get user chats
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
      isActive: true
    })
      .populate('participants', 'name avatar sellerInfo.storeName')
      .populate('product', 'name images')
      .sort({ 'lastMessage.sentAt': -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get or create chat
router.post('/start', async (req, res) => {
  try {
    const { sellerId, productId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, sellerId] },
      product: productId
    });

    if (!chat) {
      chat = new Chat({
        participants: [req.user.id, sellerId],
        product: productId,
        messages: []
      });
      await chat.save();
    }

    await chat.populate('participants', 'name avatar sellerInfo.storeName');
    await chat.populate('product', 'name images');

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chat messages
router.get('/:chatId/messages', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const messages = chat.messages
      .sort((a, b) => b.sentAt - a.sentAt)
      .slice(skip, skip + parseInt(limit))
      .reverse();

    res.json({
      messages,
      hasMore: chat.messages.length > skip + parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/:chatId/messages', async (req, res) => {
  try {
    const { message, messageType = 'text' } = req.body;

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = {
      sender: req.user.id,
      message,
      messageType,
      sentAt: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = {
      message,
      sentAt: new Date(),
      sender: req.user.id
    };

    await chat.save();

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.put('/:chatId/read', async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== req.user.id.toString()) {
        msg.isRead = true;
      }
    });

    await chat.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
