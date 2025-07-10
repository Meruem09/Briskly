import React, { useState, useEffect, use } from 'react';
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
  const [progress, setProgress] = useState(null);
  const [response, setResponse] = useState(null);

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
    const token = await getToken();
    const res = await axios.get('http://localhost:3000/chats/getChat', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChats(res.data); // ✅ store all chats in state

    // Load last used chatId
    const lastChatId = localStorage.getItem('chatId');
    const validChat = res.data.find(chat => chat.id === Number(lastChatId));

    if (validChat) {
      setSelectedChatId(validChat.id);
      setMessages(validChat.messages);
    } else if (res.data.length > 0) {
      setSelectedChatId(res.data[0].id);
      setMessages(res.data[0].messages);
    }
  };

  fetchChats();
}, []); // ✅ Remove [chatId], run only once on mount


useEffect(() => {
    let cancelled = false;

    const createChat = async () => {
      if (cancelled) return;
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const res = await fetch("http://localhost:3000/chats", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: 'include',
        });

        const data = await res.json();
        if (!cancelled) {
          if (res.ok) {
            setChatId(data.id);
          } else {
            setError("Failed to create chat: " + (data.error || res.statusText));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to create chat: ' + err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
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
        <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-pink-900 scrollbar-track-red-900 h-64 p-2 overflow-y-auto space-y-4 mb-4">
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
          <button
            onClick={handleSend}
            disabled={!chatId || !prompt.trim()}
            className="  text-white text-2xl px-4 py-2 rounded-xl disabled:text-white-100"
          >
            <IoMdAttach
             className={isDisabled ? "text-white" : "text-blue-500"}
            />
          </button>          
          <button
            onClick={handleSend}
            disabled={!chatId || !prompt.trim()}
            className="  text-white text-2xl px-4 py-2 rounded-xl disabled:text-white-100"
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