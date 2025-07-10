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

router.post('/', async (req,res) => {
    const { clerkId } =  req.body;
    const userPref = await prisma.userPreference.findUnique({
        where: { userClerkId: clerkId}
    })
    const model = genAi.getGenerativeModel({model: 'gemini-2.0-flash-lite'});
    if(parsedFileName){
        parsedFilePath = path.join('C:/BRISKLY/briskly/uploads', parsedFileName)
        try{
            const parseText = fs.readFileSync(parsedFilePath, 'utf-8');
            const promt = `${userInfo} tell me something good & Read the content from the file and give answer in points file:${parseText}`
        }catch(err){
            return res.status(400).json({
                error: "file not found or unreadable"
            })
        }
    }
    const {parsedFileName} = req.body // add "question" in field later
    const parsedFilePath = path.join('C:/BRISKLY/briskly/server/uploads', parsedFileName)
    
    try{
        const parseText = fs.readFileSync(parsedFilePath, 'utf-8');
        const userInfo = `name: ${userPref.name}, gender: ${userPref.gender}, education_status:${userPref.educationStatus}, preferred_explanation_style:${userPref.explanationStyle}, comfortable_language:${userPref.comfortLanguage}`
        const promt = `${userInfo} tell me something good & Read the content from the file and give answer in points file:${parseText}`
        const result = await model.generateContent([
            {text: promt}
        ])

        const ans = result.response.text();

        console.log(ans)
        res.json({ answer: ans });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Failed to process Gemini request' })
    } 
    finally{
        fs.unlinkSync(parsedFilePath);
    }

})

export default router;

