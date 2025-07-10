import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    educationStatus: "",
    explanation: "",
    language: "",
  });

  const navigate_to = useNavigate();
  
  const handleMain = () => {
    navigate_to('/main');
  }

  const handleChat = () => {
    navigate_to('/chat');
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      console.log("Onboarding Complete:", formData);
      handleMain();
      // Redirect or save to DB
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-[#121212] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Let’s Personalize Your Experience ✨</h2>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Tyler"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex space-x-3">
                {["Male ♂️", "Female ♀️", "prefer not to say"].map((option) => (
                  <label
                    key={option}
                    className={`flex-1 py-2 text-center text-sm rounded-lg border cursor-pointer transition-colors ${
                      formData.gender === option
                        ? "bg-blue-600 border-blue-600"
                        : "bg-gray-950 border-gray-600 hover:bg-gray-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      className="hidden"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium mb-2">What's your current education status?</label>
            <div className="flex space-x-3">
            {["School 🎒", "College 🎓"].map((option) => (
                  <label
                    key={option}
                    className={`flex-1 py-2 text-center text-sm rounded-lg border cursor-pointer transition-colors ${
                      formData.educationStatus === option
                        ? "bg-blue-600 border-blue-600"
                        : "bg-gray-950 border-gray-600 hover:bg-gray-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name="educationStatus"
                      value={option}
                      checked={formData.gender === option}
                      onChange={(e) => handleChange("educationStatus", e.target.value)}
                      className="hidden"
                    />
                    {option}
                  </label>
                ))}
                </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Explanation Style</label>
            <select
              value={formData.explanation}
              onChange={(e) => handleChange("explanation", e.target.value)}
              className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select one</option>
              <option value="Visual">Visual (diagrams, charts)</option>
              <option value="Simple">Simple & Easy</option>
              <option value="Detailed">In-depth & Detailed</option>
              <option value="Fast-paced">Quick Summary</option>
            </select>
          </div>
        )}

        {step === 4 && (
          <div>
            <label className="block text-sm font-medium mb-2">Comfort Language</label>
            <select
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Bengali">Bengali</option>
              <option value="Telugu">Telugu</option>
              <option value="Kannada">Kannada</option>
            </select>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          {step < 4 ? "Continue →" : "Finish →"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
