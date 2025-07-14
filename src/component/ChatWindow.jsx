import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { LuSendHorizontal } from 'react-icons/lu';
import { IoMdAttach } from 'react-icons/io';

export default function ChatWindow() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedParsedFileName, setUploadedParsedFileName] = useState('');
  const fileInputRef = useRef(null);

  // Load or create chat on mount
  useEffect(() => {
    const initializeChat = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        // Check if chatId exists in localStorage
        const storedChatId = localStorage.getItem('chatId');

        if (storedChatId) {
          // Use existing chatId
          setChatId(Number(storedChatId));
          await loadMessages(Number(storedChatId), token);
        } else {
          // Fetch existing chats
          const res = await axios.get('http://localhost:3000/chats/getChat', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!Array.isArray(res.data)) {
            throw new Error('Invalid chats response');
          }

          const sortedChats = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

          if (sortedChats.length > 0) {
            // Use the most recent chat
            setChatId(sortedChats[0].id);
            localStorage.setItem('chatId', sortedChats[0].id);
            await loadMessages(sortedChats[0].id, token);
          } else {
            // Create new chat
            const res = await axios.post(
              'http://localhost:3000/chats',
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                withCredentials: true,
              }
            );
            setChatId(res.data.id);
            localStorage.setItem('chatId', res.data.id);
            setMessages([]);
          }
        }
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, []);

  const loadMessages = async (id, token) => {
    try {
      const response = await axios.get(`http://localhost:3000/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages');
    }
  };

  const handleSend = async () => {
    if (!prompt.trim() || !chatId) return;

    const userMessage = { sender: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');

    try {
      const token = await getToken();
      const res = await axios.post(
        'http://localhost:3000/gemini',
        {
          chatId,
          prompt,
          parsedFileName: uploadedParsedFileName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (!res.data?.answer) {
        throw new Error('No answer received from server');
      }

      const aiMessage = { sender: 'ai', content: res.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
      setUploadedParsedFileName('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) => [...prev, { sender: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
      setError(err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
      const res = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setUploadedParsedFileName(res.data.parsedFileName);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file');
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-gray-950 rounded-2xl shadow-lg h-[80vh] flex items-center justify-center">
        <div className="text-white">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-gray-950 rounded-2xl shadow-lg h-[80vh] flex items-center justify-center">
        <div className="text-red-500">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-1 shadow-lg h-[80vh] flex flex-col">
      <div className="flex-1 overflow-auto custom-scrollbar p-2 space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl max-w-xs ${
              msg.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-600 text-white'
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
          className="flex-1 text-white bg-transparent rounded-3xl p-2"
          placeholder="Type your message..."
          disabled={!chatId}
        />
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button onClick={handleAttachClick} className="text-white text-2xl py-2 rounded-xl">
          <IoMdAttach />
        </button>
        <button
          onClick={handleSend}
          disabled={!chatId || !prompt.trim()}
          className="text-white text-2xl px-3 py-2 rounded-xl disabled:opacity-50"
        >
          <LuSendHorizontal className={!chatId || !prompt.trim() ? 'text-white' : 'text-blue-500'} />
        </button>
      </div>
    </div>
  );
}