import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /messages — Add a message to a chat

// GET /messages/:chatId — Get all messages in a chat
router.get('/:chatId', async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: { chatId: parseInt(chatId) },
      orderBy: { sentAt: 'asc' },
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
