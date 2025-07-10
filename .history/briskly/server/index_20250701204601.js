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
app.use('/gemini', geminiRoutes); // add middleware requireAuth later


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
