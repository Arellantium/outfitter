import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ChatPage.css';

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Ciao! Come posso aiutarti oggi con il tuo stile?", sender: "ai" },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMessage = {
      id: messages.length + 1,
      text,
      sender: "user"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');

      const res = await fetch("http://localhost:8006/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      const aiResponse = {
        id: userMessage.id + 1,
        text: data.answer || "Non ho trovato una risposta.",
        sender: "ai"
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error("Errore:", err);
      setMessages(prev => [
        ...prev,
        { id: userMessage.id + 1, text: "Errore nel contattare l'assistente AI.", sender: "ai" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page-container">
      <header className="chat-page-header">
        <Link to="/landing-page" className="back-to-home">← Home</Link>
        <h1>stAIlist - your personal shopper</h1>
        <div className="header-placeholder"></div>
      </header>

      <div className="chat-messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-message ai">
            <p>Sto pensando...</p>
          </div>
        )}
      </div>

      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Scrivi il tuo messaggio..."
        />
        <button type="submit" className="send-button" disabled={loading}>
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
