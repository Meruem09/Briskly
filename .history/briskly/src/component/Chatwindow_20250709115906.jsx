import { useState, useEffect } from 'react';
import { useAuth } from "@clerk/clerk-react";

const ChatWindow = () => {
    const { getToken } = useAuth();
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [chatId, setChatId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);

    // Set auth token when component mounts

    // Create a new chat on first load
    useEffect(() => {
        let cancelled = false;
        const createChat = async () => {
            if (cancelled) return;
            setLoading(true);
            setError(null);
            try {
                const token = await getToken();
                setAuthToken(token);
                const res = await api.post('/chats', {});
                if (!cancelled) {
                    setChatId(res.data.id);
                }
            } catch (err) {
                if (!cancelled) {
                    setError('Failed to create chat: ' + (err.response?.data?.error || err.message));
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        if (!chatId) createChat();
        return () => { cancelled = true; };
    }, []);

    const handleSend = async () => {
        if (!prompt.trim() || !chatId) return;
        const userMessage = { sender: 'user', content: prompt };
        setMessages((prev) => [...prev, userMessage]);
        const currentPrompt = prompt;
        setPrompt('');
        try {
            const token = await getToken();
            setAuthToken(token);
            const res = await api.post('/gemini', { chatId, prompt: currentPrompt });
            const aiMessage = { sender: 'ai', content: res.data.reply };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            const errorMessage = { sender: 'ai', content: 'Sorry, I encountered an error. Please try again.' };
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
                    <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto bg-[#121212] rounded-2xl shadow-lg overflow-hidden">
            {/* Chat messages area */}
            <div className="flex-1 px-6 py-4 overflow-y-auto text-gray-200 space-y-4 mb-2 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-900">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded-xl max-w-xs ${
                            msg.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-800 text-gray-100'
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            {/* Typing area */}
            <form
                onSubmit={e => { e.preventDefault(); handleSend(); }}
                className="w-full bg-[#181c24] px-4 py-3 flex items-center gap-3"
            >
                <input
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 rounded-3xl p-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-none placeholder-gray-400"
                    placeholder="Type your message..."
                    disabled={!chatId}
                    style={{ border: "none" }}
                />
                <button type="button" tabIndex={-1} className="flex items-center justify-center">
                    <img src={attachIcon} alt="attach" className='w-6 h-6 cursor-pointer opacity-80 hover:opacity-100'/>
                </button>
                <button
                    type="submit"
                    disabled={!chatId || !prompt.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors shadow disabled:bg-gray-400"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;