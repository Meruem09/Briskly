import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@clerk/express';

const app = express();
const PORT = 3000;

app.use(requireAuth());
app.use(express.json());
app.use(cors({
    origin: 'https://localhost:5173',
    credentials: true
}));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
