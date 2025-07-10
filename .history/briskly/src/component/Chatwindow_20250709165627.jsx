import React, { useState, useEffect, use } from 'react';
import { useAuth } from "@clerk/clerk-react";
import api from '../../server/routes/api';

export default function ChatWindow() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [response, setResponse] = useState(null);

  // Set auth token when component mounts

  // Create a new chat on first load
  useEffect(() => {
    let cancelled = false;

    const createChat = async () => {
      if (cancelled) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const token = getToken();
        
        // Make sure we have auth token first
        
        const res = await fetch("http://localhost:3000/chats", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json"
            },
            credentials: 'include', 
    });

        const data = res.json();        
        if (!cancelled) {
          console.log('Chat created successfully:', res.data);
          setChatId(res.data.id);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to create chat:', err);
          console.error('Error response:', err.response?.data);
          console.error('Error status:', err.response?.status);
          setError('Failed to create chat: ' + (err.response?.data?.error || err.message));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    // Only create chat if we don't have one
    if (!chatId) {
      createChat();
    }

    return () => {
      cancelled = true;
    };
  }, []); // No dependencies

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
      
      // Refresh token before sending
      const token = await getToken();
      setAuthToken(token);
      
      const res = await api.post('/gemini', {
        chatId,
        prompt: currentPrompt,
      });

      const aiMessage = {
        sender: 'ai',
        content: res.data.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
      console.error('Error response:', err.response?.data);
      
      // Add error message to chat
      const errorMessage = {
        sender: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
            className="flex-1 rounded-3xl p-2"
            placeholder="Type your message..."
            disabled={!chatId}
          />
          <button>
            <img src={''}  className='w-6 h-6 cursor-pointer'/>
          </button>
          <button
            onClick={handleSend}
            disabled={!chatId || !prompt.trim()}
            className="bg-blue-600  text-white px-4 py-2 rounded-xl disabled:bg-gray-400"
          >
            Send
          </button>

        </div>
      </div>
    </div>
  );
}