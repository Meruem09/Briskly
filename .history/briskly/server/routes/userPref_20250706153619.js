import expresss from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@clerk/express";

const prisma = new PrismaClient();
const router = expresss.Router();

router.post('/', requireAuth, async(req, res) => {
    try{
        if(formData){
            console.log("userPred added successfully")
            console.log(formData);
        }
        else{
            console.log("some error occured in formData")
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            error: "Internal server error"
        });  
    }
})