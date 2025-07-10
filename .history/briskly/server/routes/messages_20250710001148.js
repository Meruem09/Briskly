import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /messages — Add a message to a chat
router.post('/', async (req, res) => {
  const { chatId, sender, content } = req.body;

  if (!chatId || !sender || !content) {
    return res.status(400).json({ error: 'chatId, sender, and content are required' });
  }

  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        sender,
        content,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

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

export default rou
