// src/components/AiChatPopup.js
import React, { useState, useEffect, useRef } from 'react';
import './AiChatPopup.css';

// Icone
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const MaximizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
  </svg>
);

const MinimizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
  </svg>
);

const AiChatPopup = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!showIntro) {
      scrollToBottom();
    }
  }, [messages, showIntro]);

  useEffect(() => {
    if (!showIntro && messages.length === 0) {
      setMessages([
        { id: `ai-popup-${Date.now()}`, text: "Ciao! Come posso aiutarti con il tuo stile?", sender: "ai" },
      ]);
    }
  }, [showIntro, messages.length]);

  const handleStartChat = () => {
    setShowIntro(false);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMessageId = `user-popup-${Date.now()}-${Math.random()}`;
    const aiMessageId = `ai-popup-${Date.now()}-${Math.random()}`;

    const userMessage = { id: userMessageId, text, sender: "user" };
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
      console.error("Errore durante l'invio del messaggio (popup):", err);
      setMessages(prev => [
        ...prev,
        { id: aiMessageId, text: `Oops! C'è stato un problema: ${err.message}`, sender: "ai" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-popup-overlay" onClick={onClose}>
      <div
        className={`ai-chat-popup ${isMaximized ? 'maximized' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ai-chat-popup-header">
          <span className="ai-chat-popup-title">stAIlist Assistant</span>
          <div className="ai-chat-popup-controls">
            <button onClick={toggleMaximize} className="ai-chat-control-button" aria-label={isMaximized ? "Ripristina dimensione" : "Massimizza chat"}>
              {isMaximized ? <MinimizeIcon /> : <MaximizeIcon />}
            </button>
            <button onClick={onClose} className="ai-chat-control-button" aria-label="Chiudi chat">
              <CloseIcon />
            </button>
          </div>
        </header>

        {showIntro ? (
          <div className="ai-chat-intro-view">
            <h2 className="intro-title">Scopri il Tuo Stile Unico</h2>
            <p className="intro-subtitle">
              Trova il tuo look perfetto. Ricevi idee outfit e consulenza di stile personalizzata dalla nostra AI.
            </p>
            <button onClick={handleStartChat} className="intro-start-button">
              Inizia Ora
            </button>
          </div>
        ) : (
          <>
            <div className="ai-chat-popup-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`ai-chat-message ${msg.sender}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
              {loading && (
                <div className="ai-chat-message ai loading-dots">
                  <p><span>.</span><span>.</span><span>.</span></p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="ai-chat-popup-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Chiedi all'AI..."
                disabled={loading}
                aria-label="Scrivi un messaggio all'AI"
              />
              <button type="submit" className="ai-chat-send-button" disabled={loading || !inputValue.trim()} aria-label="Invia messaggio">
                <SendIcon />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AiChatPopup;
