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
    const clerkUserId = req.auth?.userId;
    const { parsedFileName, givenPrompt } =  req.body;
    const userPref = await prisma.userPreference.findUnique({
        where: { userClerkId: userId}
    })
    const model = genAi.getGenerativeModel({model: 'gemini-2.0-flash-lite'});
    let parseText = "";
    let parsedFilePath = "";
    if(parsedFileName){
        parsedFilePath = path.join('C:/BRISKLY/briskly/server/uploads', parsedFileName)
        try{
            parseText = fs.readFileSync(parsedFilePath, 'utf-8');
        }catch(err){
            return res.status(400).json({
                error: "file not found or unreadable"
            })
        }
    }
    
    try{
        const userInfo = `name: ${userPref.name}, gender: ${userPref.gender}, education_status:${userPref.educationStatus}, preferred_explanation_style:${userPref.explanationStyle}, comfortable_language:${userPref.comfortLanguage}. this is user info use only this to make the interaction more personalized.`
        let promt = `${userInfo}, Promt: ${givenPrompt},`

        if(parseText){
            promt += `read this text and give answer. text:${parseText}`;
        }

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


