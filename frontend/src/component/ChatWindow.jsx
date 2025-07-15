import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { LuSendHorizontal } from 'react-icons/lu';
import { IoMdAttach } from 'react-icons/io';
import  ReactMarkdown  from 'react-markdown';

export default function ChatWindow() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedParsedFileName, setUploadedParsedFileName] = useState('');
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Load or create chat on mount
  useEffect(() => {
    const initializeChat = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Check if chatId exists in localStorage
        const storedChatId = localStorage.getItem('chatId');

        if (storedChatId) {
          // Use existing chatId
          setChatId(Number(storedChatId));
          await loadMessages(Number(storedChatId), token);
        } else {
          // Fetch existing chats
          const res = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/chats/getChat`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });

          // Validate response data
          const chats = Array.isArray(res.data) ? res.data : res.data?.chats || [];
          if (!Array.isArray(chats)) {
            throw new Error('Invalid chats response: Expected an array');
          }

          const sortedChats = chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

          if (sortedChats.length > 0) {
            // Use the most recent chat
            setChatId(sortedChats[0].id);
            localStorage.setItem('chatId', sortedChats[0].id);
            await loadMessages(sortedChats[0].id, token);
          } else {
            // Create new chat
            const newChatRes = await axios.post(
              `${import.meta.env.VITE_APP_BE_BASEURL}/chats`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                withCredentials: true,
              }
            );

            if (!newChatRes.data?.id) {
              throw new Error('Failed to create new chat: No ID returned');
            }

            setChatId(newChatRes.data.id);
            localStorage.setItem('chatId', newChatRes.data.id);
            setMessages([]);
          }
        }
      } catch (err) {
        console.error('Error initializing chat:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config,
        });
        setError(`Failed to initialize chat: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [getToken]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const loadMessages = async (id, token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid messages response: Expected an array');
      }

      setMessages(response.data);
    } catch (err) {
      console.error('Failed to load messages:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(`Failed to load messages: ${err.message}`);
    }
  };

  const handleSend = async () => {
    if (!prompt.trim() || !chatId) return;

    const userMessage = { sender: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');

    try {
      setIsTyping(true);
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const res = await axios.post(
        `${import.meta.env.VITE_APP_BE_BASEURL}/gemini`,
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
      console.error('Failed to send message:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
      setError(`Failed to send message: ${err.message}`);
    } finally {
      setIsTyping(false);
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
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const res = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (!res.data?.parsedFileName) {
        throw new Error('No parsed file name returned from server');
      }

      setUploadedParsedFileName(res.data.parsedFileName);
      fileInputRef.current.value = ''; // Clear file input
    } catch (err) {
      console.error('Error uploading file:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(`Failed to upload file: ${err.message}`);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-transparent rounded-2xl shadow-lg h-[80vh] flex items-center justify-center">
        <div className="text-white">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-transparent rounded-2xl shadow-lg h-[80vh] flex items-center justify-center">
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
    <div className="max-w-2xl mx-auto mt-10 p-1 shadow-lg h-[80vh] flex flex-col">
      <div className="flex-1 overflow-auto custom-scrollbar p-2 space-y-4 mb-4" ref={containerRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl w-full ${
              msg.sender === 'user' ? 'bg-blue-500 text-white ml-auto max-w-xs' : 'bg-gray-600 text-white max-w-[80%]'
            }`}
          >
            {msg.sender === 'ai' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
          </div>
        ))}
      </div>
      {isTyping && (
        <div className="p-2 rounded-xl text-white animate-pulse">
          Typing<span className="dot-flash">...</span>
        </div>
      )}
      {uploadedParsedFileName && (
        <div className="p-2 text-center rounded-xl text-blue-500">
          File Uploaded 🎉: {uploadedParsedFileName}
        </div>
      )}
      <div className="flex gap-2 p-2 border border-blue-500 rounded-3xl">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 text-white bg-transparent rounded-3xl p-2"
          placeholder="Type your message..."
          disabled={!chatId}
        />
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button
          onClick={handleAttachClick}
          className="text-gray-300 cursor-pointer text-2xl py-2 rounded-xl hover:text-white"
        >
          <IoMdAttach />
        </button>
        <button
          onClick={handleSend}
          disabled={!chatId || !prompt.trim()}
          className="text-gray-300 hover:text-white text-2xl px-3 py-2 rounded-xl cursor-pointer disabled:opacity-50"
        >
          <LuSendHorizontal className={!chatId || !prompt.trim() ? 'text-gray-300' : 'text-blue-500'} />
        </button>
      </div>
    </div>
  );
}