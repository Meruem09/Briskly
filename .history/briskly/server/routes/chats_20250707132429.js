// routes/chats.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const findOrCreateUser = require('../utils/middleware.cjs');

// Create a new chat for a user
router.post('/', async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) { 
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await findOrCreateUser(clerkUserId);

    const newChat = await prisma.chat.create({
      data: {
        userId: user.id, // 🔗 link to our DB user
      },
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

module.exports = router;
