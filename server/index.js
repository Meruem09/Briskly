import express, { urlencoded } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@clerk/express';


const app = express();
const prisma = new PrismaClient();
const PORT = 3000;
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cors({
    origin: `${process.env.VITE_FE_URL}`,
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

import GQUizzesRoutes from './routes/GQuizzes.js';
app.use('/GQuizzes',  GQUizzesRoutes); // add middleware requireAuth later

import ytRoutes from './routes/yt.js';
app.use('/yt',  ytRoutes); // add middleware requireAuth later

app.get('/', (req, res) => {
  res.json({ message: "API server running" });
});


app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
