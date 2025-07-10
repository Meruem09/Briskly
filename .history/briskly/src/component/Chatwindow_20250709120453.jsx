import { useState } from "react";

const ChatWindow = () => {
    const [input, setInput] = useState("");

      useEffect(() => {
    let cancelled = false;

    const createChat = async () => {
      if (cancelled) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Creating new chat...');
        
        // Make sure we have auth token first
        const token = await getToken();
        setAuthToken(token);
        
        const res = await api.post('/chats', {}); 
        
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



    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        // TODO: send message logic
        setInput("");
    };

    return (
        <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto bg-[#121212] rounded-2xl shadow-lg overflow-hidden">
            {/* Chat messages area (empty for now) */}
            <div className="flex-1 px-6 py-4 overflow-y-auto text-gray-200">
                {/* Messages will go here */}
            </div>
            {/* Typing area */}
            <form
                onSubmit={handleSend}
                className="w-full bg-[#181c24] px-4 py-3 flex items-center gap-3"
            >
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-none placeholder-gray-400"
                    style={{ border: "none" }}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors shadow"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;