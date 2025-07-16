import express from 'express';
import { PrismaClient } from '@prisma/client';
import findOrCreateUser from '../utils/middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// new chat for a user
router.post('/', async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await findOrCreateUser(clerkUserId);

    const newChat = await prisma.chat.create({
      data: {
        userId: user.id,
      },
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// fetch chat 
router.get('/getChat', async (req, res) => {
  const { userId } = req.auth; // 

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get the DB user by Clerk ID
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const chats = await prisma.chat.findMany({
    where: { userId: user.id },
    orderBy: { startedAt: 'desc' },
    include: {
      messages: {
        orderBy: { sentAt: 'asc' }
      },
    },
  });

  res.json(chats);
});


export default router;
