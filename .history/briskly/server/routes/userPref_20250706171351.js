import expresss from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = expresss.Router();

router.post('/', async(req, res) => {
    try{
        const {name, gender, educationStatus, explanation, language} = req.body;
        const {userClerkId} = req.auth;

        const userPref = await prisma.UserPreference.upsert({
            where: {userClerkId},
            update: { name, gender, educationStatus, explainationStyle: explanation, comfortLanguage: language},
            create: {name, gender, educationStatus, explainationStyle: explanation, comfortLanguage: language}
        })
        res.status(200).json({ success: true, data: userPref});
    }catch(err){
        console.error(err);
        res.status(500).json({ success: false, error: err.message});  
    }
})

export default router;