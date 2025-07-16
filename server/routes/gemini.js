import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv" 
import fs from 'fs'
import path from "path"

const prisma = new PrismaClient();
const router = express.Router()
dotenv.config();
const genAi = new GoogleGenerativeAI(process.env.API_KEY);
// gemini res request
router.post('/', async (req, res) => {
  try {
    const { chatId, prompt, parsedFileName } = req.body;

    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.message.create({
      data: {
        chatId: parseInt(chatId),
        sender: 'user',
        content: prompt,
      },
    });


    const userPref = await prisma.userPreference.findUnique({
      where: { userClerkId: clerkId }
    });

    const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    let parseText = "";
    let parsedFilePath = "";

    const uploadDir = path.join(process.cwd(), 'uploads');

    if (parsedFileName) {
      const parsedFilePath = path.join(uploadDir, parsedFileName);
      if (fs.existsSync(parsedFilePath)) {
        parseText = fs.readFileSync(parsedFilePath, 'utf-8');
      } else {
        return res.status(400).json({ error: "File not found or unreadable" });
      }
    }

    const userInfo = `userInfo => name: ${userPref.name}, gender: ${userPref.gender}, education_status: ${userPref.educationStatus}, preferred_explanation_style: ${userPref.explanationStyle}, comfortable_language: ${userPref.comfortLanguage}. Use this info to personalize.`;

    const styleInstructions = `
    You are a friendly, modern AI assistant for the app Briskly.
    You always reply in a casual, upbeat style.
    Use emojis naturally, keep responses short and human-like.
    Never sound robotic or formal.
    Examples:
    - "Yo! 😎 Need help with something?"
    - "Hey hey! 🚀 I'm ready when you are!"
    - "Awesome! 🙌 Let's dive in."
    `;

    let finalPrompt = `${userInfo} Style: ${styleInstructions} User Prompt: ${prompt}`;

    if (parseText) {
      finalPrompt += `\n text/file: ${parseText}`;
    }

    const result = await model.generateContent([{ text: finalPrompt }]);
    const ans = result.response.text();

    console.log('Gemini answer:', ans);

        if (parsedFilePath && fs.existsSync(parsedFilePath)) {
      fs.unlinkSync(parsedFilePath);
    }


    res.json({ answer: ans });


    await prisma.message.create({
      data: {
        chatId: parseInt(chatId),
        sender: 'ai',
        content: ans,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process Gemini request' });
  }
});
export default router;