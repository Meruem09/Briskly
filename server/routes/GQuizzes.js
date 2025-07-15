import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import fs from 'fs'
import path from "path"
import { extractJSON } from "../utils/extractJSON.js"

const router = express.Router()
const genAi = new GoogleGenerativeAI(process.env.API_KEY);

router.post('/', async (req, res) => {
  try {
    const { parsedFileName } = req.body;

    const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    let parseText = "";
    let parsedFilePath = "";
    
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    if (parsedFileName) {
      const parsedFilePath = path.join(uploadDir, parsedFileName);
      if (fs.existsSync(parsedFilePath)) {
        parseText = fs.readFileSync(parsedFilePath, 'utf-8');
      } else {
        return res.status(400).json({ error: "File not found or unreadable" });
      }
    }

    let finalPrompt = `Prompt: "Read the text below and generate 5 multiple-choice questions.
Output only valid JSON like this:
[
  {
    \"question\": \"What is the powerhouse of the cell?\",
    \"options\": [\"Ribosome\", \"Nucleus\", \"Mitochondria\", \"Golgi apparatus\"],
    \"answer\": \"Mitochondria\"
  },
  ...
]
Text:${parseText}
`;

    const result = await model.generateContent([{ text: finalPrompt }]);
    let ans = result.response.text();

    if (ans.startsWith("```")) {
     ans = ans.replace(/```json|```/g, '').trim();
}



    console.log('Gemini answer:', ans);


    const extractedJSON = extractJSON(ans);

    if (!extractedJSON) {
      return res.status(500).json({ error: 'Could not extract JSON from Gemini response.' });
    }

      if (parsedFilePath && fs.existsSync(parsedFilePath)) {
        fs.unlinkSync(parsedFilePath);
      }


    res.json({ answer: extractedJSON });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process Gemini request' });
  }
});
export default router;