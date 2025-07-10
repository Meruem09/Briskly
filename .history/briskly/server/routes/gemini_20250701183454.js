import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import multer from 'multer'
import pdf from 'pdf-parse'
import fs from 'fs'
import path from "path"


const router = express.Router()
dotenv.config();
const genAi = new GoogleGenerativeAI(process.env.API_KEY);

router.post('/', async (res,res) => {

    const model = genAi.getGenerativeModel({model: 'gemini-2.0-flash-lite'});
    const {parsedFileName, question} = req.body
    const parsedFilePath = path.join('uploads', parsedFileName)
    
    try{
        const parseText = fs.readFileSync(parsedFilePath, 'utf-8');

        const promt = `Read the content from the file and give answer in points file:${parseText}`
        const result = model.generateContent([
            {text: promt}
        ])

        const ans = result.response.text();

        console.log(ans)
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Failed to process Gemini request' })
    }

})

