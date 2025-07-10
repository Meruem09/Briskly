import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import multer from 'multer'
import pdf from 'pdf-parse'
import fs from 'fs'


const router = express.Router()
dotenv.config();
const genAi = new GoogleGenerativeAI(process.env.API_KEY);

router.post('/', async (res,res) => {

    const model = genAi.getGenerativeModel({model: 'gemini-2.0-flash-lite'});

    const filepath = './uploads/file'
    const dataBuffer = fs.readFileSync(filepath);
    const parsed = await pdf(dataBuffer);

    const promt = "Read the data from the file and explain it to me in simplest way";

    const result = model.generateContent([
        parsed.text(),
        {text: promt}
    ])
    const answer = result.response.text()
    console.log(answer);

    fs.unlinkSync(filepath);
})

