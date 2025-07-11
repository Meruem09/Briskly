import express, { urlencoded } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@clerk/express';

const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


import userRoutes from './routes/user.js';
app.use('/user', requireAuth(), userRoutes);

import uploadRoutes from './routes/upload.js';
app.use('/upload', uploadRoutes); // add middleware requireAuth later

import geminiRoutes from './routes/gemini.js';
app.use('/gemini',requireAuth(), geminiRoutes); // add middleware requireAuth later

import chatRoutes from './routes/chats.js';
app.use('/chats',requireAuth(), chatRoutes); // add middleware requireAuth later

import messageRoutes from './routes/messages.js';
app.use('/messages',requireAuth(), messageRoutes); // add middleware requireAuth later

import userPrefRoutes from './routes/userPref.js';
app.use('/userPref', requireAuth(), userPrefRoutes); // add middleware requireAuth later

app.get('/', (req, res) => {
  res.json({ message: "API server running" });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
