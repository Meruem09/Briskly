import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import multer from 'multer'
import pdf from 'pdf-parse'
import fs from 'fs'



const upload = multer({
  dest: '/uploads',
  limits: { fileSize: 1000000 } // Limit file size to 1MB
});


dotenv.config();



const genAi = new GoogleGenerativeAI(process.env.API_KEY);



async function Ai(){
    const model = genAi.getGenerativeModel({model:'gemini-2.0-flash-lite'});
    const promt = "Hello gemini whats going on it's been a while since i talk to you";
    const result = await model.generateContent([{text: promt}]);

    const aiContent = result.response.text();

    console.log(aiContent);
};

Ai();