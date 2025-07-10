const express = require('express');
const cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require("@clerk/express");


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
