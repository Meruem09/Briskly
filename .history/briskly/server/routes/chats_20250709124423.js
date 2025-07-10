import express from 'express';
import { PrismaClient } from '@prisma/client';
import findOrCreateUser from '../utils/middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

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

export default router;
