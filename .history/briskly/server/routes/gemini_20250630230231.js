import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"

const genAi = new GoogleGenerativeAI(process.env.API_KEY);
const prisma = PrismaClient();
const router = express.Router();
const app = express();

app.post("/", async(req, res) => {
    const model = genAi.getGenerativeModel({model:'gemin-2.0-flash-lite'});
    const promt = "Hello gemini whats going on it's been a while since i talk to you";
    const result = await model.generateContent({text: promt});

    aiContent = result.response.text();

    console.log(aiContent);
})