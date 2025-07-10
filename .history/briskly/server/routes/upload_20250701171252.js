import express from "express"
import multer from 'multer'
import pdf from 'pdf-parse'
import fs from 'fs'

const router = express.Router();


// Initialize upload
const upload = multer({
  dest: './uploads',
  limits: { fileSize: 5000000 } // Limit file size to 1MB
});

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

export default router;