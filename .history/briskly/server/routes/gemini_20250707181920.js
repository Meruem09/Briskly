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
    const { clerkId, parsedFileName } =  req.body;
    const userPref = await prisma.userPreference.findUnique({
        where: { userClerkId: clerkId}
    })
    const model = genAi.getGenerativeModel({model: 'gemini-2.0-flash-lite'});
    let parseText = "";
    let parsedFilePath = "";
    if(parsedFileName){
        parsedFilePath = path.join('C:/BRISKLY/briskly/uploads', parsedFileName)
        try{
            parseText = fs.readFileSync(parsedFilePath, 'utf-8');
        }catch(err){
            return res.status(400).json({
                error: "file not found or unreadable"
            })
        }
    }
    
    try{
        let promt = ""
        const userInfo = `name: ${userPref.name}, gender: ${userPref.gender}, education_status:${userPref.educationStatus}, preferred_explanation_style:${userPref.explanationStyle}, comfortable_language:${userPref.comfortLanguage}`
        if(parseText){
            promt += `, read this file and give answer. file:${parseText}`;
        }
        promt = `${userInfo} tell me something good about me`
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

