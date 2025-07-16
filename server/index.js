import express, { urlencoded } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@clerk/express';


const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cors({
    origin: `${process.env.VITE_FE_URL}`,
    credentials: true
}));


import userRoutes from './routes/user.js';
app.use('/user', requireAuth(), userRoutes);

import uploadRoutes from './routes/upload.js';
app.use('/upload', uploadRoutes); 

import geminiRoutes from './routes/gemini.js';
app.use('/gemini',requireAuth(), geminiRoutes); 

import chatRoutes from './routes/chats.js';
app.use('/chats',requireAuth(), chatRoutes); 

import messageRoutes from './routes/messages.js';
app.use('/messages',requireAuth(), messageRoutes); 

import userPrefRoutes from './routes/userPref.js';
app.use('/userPref', requireAuth(), userPrefRoutes); 

import GQUizzesRoutes from './routes/GQuizzes.js';
app.use('/GQuizzes',  GQUizzesRoutes); 

import ytRoutes from './routes/yt.js';
app.use('/yt',  ytRoutes); 

app.get('/', (req, res) => {
  res.json({ message: "API server running" });
});


app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
