import expresss from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = expresss.Router();

router.post('/', async(req, res) => {
    try{
        const {name, gender, educationStatus, explanation, language} = req.body;
        const {userId} = req.auth();
        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        
        if(!user){
            return res.status(404).json({ success: false, error:"User not found"})
        }
        const userPref = await prisma.userPreference.upsert({
            where: {userClerkId:  user.clerkId},
            update: { name, gender, educationStatus, explainationStyle: explanation, comfortLanguage: language},
            create: {name, gender, educationStatus, explainationStyle: explanation, comfortLanguage: language, user: {connect: {clerkId: user.clerkId}}}
        })
        res.status(200).json({ success: true, data: userPref});
    }catch(err){
        console.error(err);
        res.status(500).json({ success: false, error: err.message});  
    }
})

export default router;