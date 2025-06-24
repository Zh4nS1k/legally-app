import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatSection.css';

function ChatSection() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { text: data.response, isUser: false },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: 'Sorry, there was an error.', isUser: false },
        ]);
      }
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { text: 'Server connection error.', isUser: false },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearHistory = async () => {
    try {
      const response = await fetch('/clear', { method: 'POST' });
      if (response.ok) {
        setMessages([
          {
            text: "Hello! I'm your AI assistant. How can I help you today?",
            isUser: false,
          },
        ]);
      }
    } catch {
      console.error('Error clearing history');
    }
  };

  const exportChat = () => {
    const chatText = messages
      .map((m) => `${m.isUser ? 'User' : 'AI'}: ${m.text}`)
      .join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_export.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chat-container">
      <div className="chat-header">🤖 OpenAI Chat</div>

      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`message ${m.isUser ? 'user' : 'bot'}`}>
            <div
              className={`message-avatar ${
                m.isUser ? 'user-avatar' : 'bot-avatar'
              }`}
            >
              {m.isUser ? '👤' : '🤖'}
            </div>
            <div className="message-content">{m.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span>AI is typing</span>
            <div className="typing-dots">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="controls">
          <button className="control-button" onClick={clearHistory}>
            Clear History
          </button>
          <button className="control-button" onClick={exportChat}>
            Export Chat
          </button>
        </div>

        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatSection;
