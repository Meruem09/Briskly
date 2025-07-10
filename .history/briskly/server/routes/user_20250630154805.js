import express from 'express';
import findOrCreateUser from '../utils/middleware.js';

const router = express.Router();

// POST /users — Create or find user (called after Clerk signup)
router.post('/', async (req, res) => {
  // Use req.auth() as a function per Clerk's new API
  const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
  console.log("AUTH:", auth);
  const clerkUserId = auth?.userId;
  const { username, email } = req.body;

  if (!clerkUserId) {
    return res.status(401).json({ error: 'Unauthorized - No Clerk user ID found' });
  }

  try {
    const user = await findOrCreateUser(clerkUserId, { username, email });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating/finding user :', error);
    res.status(500).json({ error: 'Failed to create or find user ' });
  }
});

// GET /users/me — Get current user info
router.get('/me', async (req, res) => {
  const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
  const clerkUserId = auth?.userId;

  if (!clerkUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await findOrCreateUser(clerkUserId);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
