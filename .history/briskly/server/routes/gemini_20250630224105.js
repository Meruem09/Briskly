import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"

const genAi = new GoogleGenerativeAI(process.env.API_KEY);