import express from "express"
import multer from 'multer'

const router = express.Router();


// Initialize upload
const upload = multer({
  dest: './uploads',
  limits: { fileSize: 5000000 } // Limit file size to 5MB
});

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded successfully: ${req.file.filename}`);

  try{
    const filePath = req.file.path
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;