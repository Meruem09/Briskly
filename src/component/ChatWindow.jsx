import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "@clerk/clerk-react";
import axios from 'axios';
import { LuSendHorizontal } from "react-icons/lu";
import { IoMdAttach } from "react-icons/io";


export default function ChatWindow() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedParsedFileName, setUploadedParsedFileName] = useState('');
  const [progress, setProgress] = useState(null);
  const fileInputRef = useRef(null);



useEffect(() => {
    if(chatId){
        loadMessages();
    }
}, [chatId]);

useEffect(() => {
  if (selectedChatId) {
    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
    } else {
      loadMessages(); // fallback: fetch from backend
    }
  }
}, [selectedChatId, chats]);


useEffect(() => {
  const fetchChats = async () => {
    try {
      const token = await getToken();
      const res = await axios.get('http://localhost:3000/chats/getChat', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(res.data)) {
        throw new Error('Invalid chats response');
      }

      // ✅ Sort by updatedAt DESC so most recent is first
      const sortedChats = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setChats(sortedChats);

      let activeId = null;

      // ✅ Try to get last used chatId from localStorage
      const lastChatId = localStorage.getItem('chatId');
      const found = sortedChats.find(chat => chat.id === Number(lastChatId));

      if (found) {
        activeId = found.id;
      } else if (sortedChats.length > 0) {
        activeId = sortedChats[0].id;
      }

      if (activeId) {
        setChatId(activeId);
        localStorage.setItem('chatId', activeId);
      } else {
        // ✅ No chats found → create new
        await createChat();
      }

    } catch (err) {
      console.error('Error fetching chats:', err);
      setError(err.message);
    }
  };

  fetchChats();
}, [chatId]);


useEffect(() => {
    let cancelled = false;

  const createChat = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch("http://localhost:3000/chats", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Created new chat:', data);
        setChatId(data.id);
        localStorage.setItem('chatId', data.id);
      } else {
        throw new Error(data.error || res.statusText);
      }
    } catch (err) {
      console.error('Failed to create chat:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    if (!chatId) createChat();
    return () => { cancelled = true; };
  }, [chatId, getToken]);

const handleSend = async () => {
  if (!prompt.trim() || !chatId) {
    console.log('Cannot send - no prompt or no chatId', { prompt: prompt.trim(), chatId });
    return;
  }

  const userMessage = {
    sender: 'user',
    content: prompt,
  };

  setMessages((prev) => [...prev, userMessage]);
  const currentPrompt = prompt;
  setPrompt('');

  try {
    console.log('Sending message to Gemini...', { chatId, prompt: currentPrompt });

    const token = await getToken();

    const res = await axios.post("http://localhost:3000/gemini", {
      chatId,
      prompt: currentPrompt,
      parsedFileName: uploadedParsedFileName,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (!res.data?.answer) {
      throw new Error("No answer received from server");
    }

    const aiMessage = {
      sender: 'ai',
      content: res.data.answer,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setUploadedParsedFileName('');
    localStorage.setItem('chatId', chatId); 

  } catch (err) {
    console.error('Failed to send message:', err);
    console.error('Error response:', err.response?.data);

    const errorMessage = {
      sender: 'ai',
      content: 'Sorry, I encountered an error. Please try again.',
    };
    setMessages((prev) => [...prev, errorMessage]);
    setError(err.message);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

const loadMessages = async () => {
    if (!chatId) return;
    const token = await getToken();
    try{
        const response = await axios.get(`http://localhost:3000/messages/${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
    });
            setMessages(response.data);
    } catch(err){
        console.error("failed to load messages:", err);
        setError("failed to load messages");
    }
};

const handleFileChange = async (e) => {
  const selected = e.target.files[0];
  if (!selected) return;

  const formData = new FormData();
  formData.append('file', selected);
  formData.append('fileName', selected.name);

  try {
    const token = await getToken();
    const res = await axios.post("http://localhost:3000/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('File uploaded:', res.data);
    setUploadedParsedFileName(res.data.parsedFileName);  // ✅ store it for Gemini

  } catch (err) {
    console.error("Error occurred while sending file:", err);
  }
};

const handleAttachClick = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};



const isDisabled = !chatId || !prompt.trim();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-gray-950 rounded-2xl shadow-lg h-[80vh] flex items-center justify-center">
        <div className="text-white">Creating chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-gray-950 rounded-2xl shadow-lg h-[80vh] flex items-center justify-center">
        <div className="text-red-500">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-2xl  mx-auto mt-10 p-1 shadow-lg h-[80vh] flex flex-col">        
        <div className="flex-1 overflow-auto custom-scrollbar h-64 p-2  space-y-4 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl  max-w-xs ${
                msg.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2 p-2 border border-blue-900 rounded-3xl">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-white rounded-3xl p-2"
            placeholder="Type your message..."
            disabled={!chatId}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />


          <button
            onClick={handleAttachClick}
           
            className="  text-white text-2xl  py-2 rounded-xl disabled:text-white-100"
          >
            <IoMdAttach
            />
          </button>          
          <button
            onClick={handleSend}
            disabled={!chatId || !prompt.trim()}
            className="  text-white text-2xl px-3 py-2 rounded-xl disabled:text-white-100"
          >
            <LuSendHorizontal
             className={isDisabled ? "text-white" : "text-blue-500"}
            />
          </button>


        </div>
      </div>
    </div>
  );
}