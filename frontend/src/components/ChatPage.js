// src/components/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link è necessario
import './ChatPage.css';

const SendIcon = () => (
  // ... (codice SVG come prima) ...
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const BackArrowIcon = () => (
    // ... (codice SVG come prima) ...
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: `ai-${Date.now()}`, text: "Ciao! Come posso aiutarti oggi con il tuo stile?", sender: "ai" },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate(); // Non più necessario qui se usiamo Link per tornare indietro

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMessageId = `user-${Date.now()}-${Math.random()}`;
    const aiMessageId = `ai-${Date.now()}-${Math.random()}`;

    const userMessage = {
      id: userMessageId,
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "Errore sconosciuto dal server." }));
        throw new Error(errorData.detail || `Errore server: ${res.status}`);
      }

      const data = await res.json();
      const aiResponse = {
        id: aiMessageId,
        text: data.answer || "Non ho trovato una risposta specifica, prova a riformulare.",
        sender: "ai"
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error("Errore durante l'invio del messaggio o la ricezione della risposta:", err);
      setMessages(prev => [
        ...prev,
        { id: aiMessageId, text: `Oops! C'è stato un problema: ${err.message}`, sender: "ai" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page-container">
      <header className="chat-page-header">
        {/* --- MODIFICA LINK QUI --- */}
        <Link to="/landingPage" className="back-to-landing-link"> {/* Cambiato to e classe */}
          <BackArrowIcon />
          <span style={{ marginLeft: '8px' }}>AI Shopper</span> {/* Testo più specifico */}
        </Link>
        <h1>stAIlist</h1>
        <div className="header-placeholder"></div>
      </header>

      <div className="chat-messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-message ai loading-dots">
            <p><span>.</span><span>.</span><span>.</span></p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Chiedi consigli di stile..."
          disabled={loading}
        />
        <button type="submit" className="send-button" disabled={loading || !inputValue.trim()}>
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;