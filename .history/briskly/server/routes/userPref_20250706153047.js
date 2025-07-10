import expresss from "express";

const router = expresss.Router()

router.post('/userPref', async(req, res) => {
    const formData = req.body;
    try{
        if(formData){
            console.log("userPred added successfully")
            console.log(formData);
        }
        else{
            console.log("some error occured in formData")
        }
    }
})