import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import QuizCard from "./QuizCard";
import axios from "axios";


const Quizzes = () => {
const [uploadedParsedFileName, setUploadedParsedFileName] = useState("");
const [isUploading ,setIsUploading] = useState(false);
const [uploadProgress ,setUploadProgress] = useState(0);
const [isGenerating, setIsGenerating] = useState(false);
const [quizzes, setQuizzes] = useState([]);
const fileInputRef = useRef(null);
const {getToken} = useAuth()

useEffect(() => {
  const stored = localStorage.getItem('quizzes');
  if (stored) {
    setQuizzes(JSON.parse(stored));
  }
}, []);

const handleReset = () => {
  setUploadedParsedFileName("");
  setQuizzes([]);
  localStorage.removeItem('quizzes');
};


const handleSend = async () => {
  if (!uploadedParsedFileName) return;

  try {
    setIsGenerating(true);
    const token = await getToken()
    const res = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/GQuizzes`, {
      parsedFileName: uploadedParsedFileName,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log('Gemini response:', res.data);

  
    const parsed = JSON.parse(res.data.answer);
    setQuizzes(parsed);
    localStorage.setItem('quizzes', JSON.stringify(parsed));
  } catch (err) {
    console.error("Failed to generate quizzes:", err);
  } finally {
    setIsGenerating(false);
  }
};

const handleFileChange = async (e) => {
  const selected = e.target.files[0];
  if (!selected) return;

  const formData = new FormData();
  formData.append('file', selected);
  formData.append('fileName', selected.name);

  setIsUploading(true);
  setUploadProgress(0);

  try {
    const token = await getToken();
    const res = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    });

    setIsUploading(false);
    console.log('File uploaded:', res.data);
    setUploadedParsedFileName(res.data.parsedFileName);

  } catch (err) {
    console.error("Upload failed:", err);
    setIsUploading(false);
  }
};

const handleAttachClick = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};



return (
  <div className="bg-[#111] bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg hover:shadow-[0_0_10px_rgba(90,175,255,0.4)] border border-gray-700 p-4">
    {/* UPLOAD AREA */}
    {quizzes.length === 0 && !isGenerating && (
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {!isUploading && !uploadedParsedFileName ? (
          // SHOW upload field BEFORE file upload
          <div
            onClick={handleAttachClick}
            className="w-100% h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-white transition-colors"
          >
            <span className="text-xs text-gray-400">Upload File</span>
          </div>
        ) : isUploading ? (
          // SHOW progress bar DURING upload
          <div className="w-40 h-4 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        ) : (
          // AFTER file uploaded
          <p className="text-green-500">✅ File uploaded!</p>
        )}

        {/* GENERATE button appears ONLY if file is uploaded */}
        {uploadedParsedFileName && (
          <button
            onClick={handleSend}
            disabled={isUploading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Generate Quizzes
          </button>
        )}
      </div>
    )}

    {/* LOADING INDICATOR */}
    {isGenerating && <p>Loading quizzes...</p>}

    {/* QUIZZES */}
    {quizzes.length > 0 && (
      <div className="space-y-8 mt-6">
        {quizzes.map((q, i) => (
          <QuizCard key={i} index={i} q={q} />
        ))}
        <button
          onClick={handleReset}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>
    )}
  </div>
);
}
 
export default Quizzes;