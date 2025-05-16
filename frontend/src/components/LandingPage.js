import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link
import './LandingPage.css';

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const LandingPage = () => {
    return (
        <div className="ai-shopper-container">
            <nav className="ai-shopper-navbar">
                <span className="nav-brand-hint">stAIlist</span>
                <div>
                    <span className="nav-item">Social Feed</span>
                    <span className="nav-item active">AI Shopper</span>
                    <span className="nav-item">Profile</span>
                </div>
            </nav>

            <main className="ai-shopper-main-content">
                <h1 className="ai-shopper-title">AI Personal Shopper</h1>
                <p className="ai-shopper-subtitle">
                    Scopri il tuo stile unico. Ricevi idee outfit, ispirazioni fotografiche e consigli personalizzati dalla nostra AI.
                </p>
                <div className="ai-shopper-button-group">
                    {/* Modificato button con Link */}
                    <Link to="/chat" className="btn btn-primary-ai">Get Started</Link>
                </div>

                <div className="ai-shopper-suggestions">
                    <div className="suggestion-card">
                        <img
                            src="https://nanostudio-official.com/cdn/shop/products/3_0e1243e1-6802-43c0-857c-74d0e4635643-579846.png?v=1682390531&width=1800"
                            alt="Outfit Ideas - Modella con outfit stiloso" />
                        <p>Outfit Ideas</p>
                    </div>
                    <div className="suggestion-card">
                        <img
                            src="https://i.pinimg.com/736x/b9/27/e1/b927e1ddaa9545acef44d856c434ff9b.jpg"
                            alt="Photo Inspiration - Cappello di paglia su sfondo neutro" />
                        <p>Photo Inspiration</p>
                    </div>
                    <div className="suggestion-card">
                        <img
                            src="https://i.pinimg.com/736x/05/e5/b7/05e5b72407c6dc7a5d7fcb07a0f957f3.jpg"
                            alt="Style Tips - Borsa chiara elegante" />
                        <p>Style Tips</p>
                    </div>
                </div>
            </main>

            {/* Modificato button con Link */}
            <Link to="/chat" className="ai-chat-button">
                <ChatIcon />
            </Link>
        </div>
    );
};

export default LandingPage;