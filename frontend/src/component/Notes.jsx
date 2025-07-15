import { useEffect, useState } from "react";
import { RxNotionLogo } from "react-icons/rx";

const Notes = () => {
  const [userText, setUserText] = useState('');

  // Retrieve notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setUserText(savedNotes);
    }
  }, []); // Empty dependency array to run only on mount

  // Save notes to localStorage when userText changes
  useEffect(() => {
    localStorage.setItem('notes', userText);
  }, [userText]); // Run whenever userText changes

  const handleNotionToggle = () => {
    window.open("https://www.notion.com/");
  };

  return (
    <div className="relative w-full h-screen p-8 bg-[#111] bg-opacity-40 backdrop-blur-md hover:shadow-[0_0_10px_rgba(90,175,255,0.4)] rounded-lg shadow-lg border border-gray-700 p-4">
      {/* Notion button */}
      <button
        onClick={handleNotionToggle}
        className="absolute top-2 right-4 flex items-center gap-2 px-4 py-2 bg-black text-white rounded shadow-md hover:bg-gray-900 transition"
      >
        <RxNotionLogo className="text-lg" />
        <span className="bg-black text-white rounded shadow-md hover:bg-gray-900">Notion</span>
      </button>

      {/* Textarea fills the whole space */}
      <textarea
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        placeholder="Write anything..."
        className="w-full h-full p-8 text-base outline-none border-none resize-none overflow-y-scroll scrollbar-hide"
      ></textarea>
    </div>
  );
};

export default Notes;