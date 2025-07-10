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

router.post('/', (res,res) => {
    const filepath = './uploads/file'
})

