// src/components/LandingPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Aggiunto useNavigate
import './LandingPage.css'; // Assicurati che questo file CSS contenga gli stili forniti

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const HomeIcon = () => ( // Icona per Home
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);


const LandingPage = () => {
    const navigate = useNavigate(); // Hook per la navigazione

    return (
        <div className="ai-shopper-container">
            <nav className="ai-shopper-navbar">
                <span className="nav-brand-hint">stAIlist</span>
                <div>
                    {/* --- NAVBAR MODIFICATA --- */}
                    <Link to="/" className="nav-item">
                        <HomeIcon />
                        <span style={{ marginLeft: '8px' }}>Home</span>
                    </Link>
                    {/* Rimosse le altre voci della navbar */}
                </div>
            </nav>

            <main className="ai-shopper-main-content">
                <h1 className="ai-shopper-title">AI Personal Shopper</h1>
                <p className="ai-shopper-subtitle">
                    Scopri il tuo stile unico. Ricevi idee outfit, ispirazioni fotografiche e consigli personalizzati dalla nostra AI.
                </p>
                <div className="ai-shopper-button-group">
                    {/* Bottone modificato per puntare a /chatPage */}
                    <Button
                        className="btn-ai btn-primary-ai"
                        onClick={() => navigate('/chatPage')} // Usa navigate per coerenza
                    >
                        Inizia Ora con l'AI
                    </Button>
                </div>

                <div className="ai-shopper-suggestions">
                    <div className="suggestion-card">
                        <img
                            src="https://nanostudio-official.com/cdn/shop/products/3_0e1243e1-6802-43c0-857c-74d0e4635643-579846.png?v=1682390531&width=1800" // Mantengo le tue immagini se ti piacciono
                            alt="Outfit Ideas - Modella con outfit stiloso" />
                        <p>Idee Outfit</p> {/* Testo in italiano */}
                    </div>
                    <div className="suggestion-card">
                        <img
                            src="https://i.pinimg.com/736x/b9/27/e1/b927e1ddaa9545acef44d856c434ff9b.jpg"
                            alt="Photo Inspiration - Cappello di paglia su sfondo neutro" />
                        <p>Ispirazioni Fotografiche</p> {/* Testo in italiano */}
                    </div>
                    <div className="suggestion-card">
                        <img
                            src="https://i.pinimg.com/736x/05/e5/b7/05e5b72407c6dc7a5d7fcb07a0f957f3.jpg"
                            alt="Style Tips - Borsa chiara elegante" />
                        <p>Consigli di Stile</p> {/* Testo in italiano */}
                    </div>
                </div>
            </main>

            {/* Bottone flottante modificato per puntare a /chatPage */}
            <Button
                className="ai-chat-button"
                onClick={() => navigate('/chatPage')}
            >
                <ChatIcon />
            </Button>
        </div>
    );
};

// Sostituisco il componente Button base con uno stilizzato se necessario,
// o mi assicuro che le classi btn-ai e btn-primary-ai siano definite nel CSS.
// Per semplicità, assumo che tu voglia un bottone standard di React (o HTML)
// e che lo stile venga da classi CSS.
// Se usi react-bootstrap Button, dovresti importarlo.
// Per questo esempio, uso un tag <button> standard e le classi che hai definito.

const Button = ({ className, onClick, children }) => (
    <button className={className} onClick={onClick}>
        {children}
    </button>
);


export default LandingPage;