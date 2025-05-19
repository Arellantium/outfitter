import React, { useState, useEffect } from 'react'; // Aggiunto useEffect
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import OrderSummarySidebar from './OrderSummarySidebar';
import './CheckoutProcess.css';

const initialOutfitDetails = { // Rinominato per chiarezza
    name: "Urban Explorer Outfit",
    items: [
        "T-Shirt Bianca \"Force Majeure\"",
        "Jeans Neri Slim Fit",
        "Sneakers Bianche"
    ],
    totalPrice: 120.00, // Questo è il subtotale dei prodotti
    currency: "€",
    imageUrl: "https://fivefourfive.it/cdn/shop/files/evbomberblackback_4a04cfdb-2531-479f-9569-5c9332074a80.png?v=1736171328"
};

const CheckoutProcess = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [shippingData, setShippingData] = useState({
        fullname: '', email: '', phone: '', address: '', city: '', zip: '', country: 'IT',
        shippingMethod: null, // Inizializzato a null o id di default se presente
        selectedShippingOption: null,
    });
    const [paymentData, setPaymentData] = useState({
        cardholder: '', cardnumber: '', expiry: '', cvv: '', paymentMethod: 'card',
    });
    const [orderNumber, setOrderNumber] = useState(null);
    const [outfitDetails, setOutfitDetails] = useState({ // Usiamo uno stato per i dettagli outfit
        ...initialOutfitDetails,
        shippingCost: 0,
        discountAmount: 0,
    });


    const handleShippingSubmit = (data) => {
        setShippingData(data);
        setOutfitDetails(prev => ({
            ...prev,
            shippingCost: data.selectedShippingOption ? data.selectedShippingOption.price : 0,
        }));
        setCurrentStep(2);
        window.scrollTo(0, 0);
    };

    const handlePaymentSubmit = (data) => {
        setPaymentData(data);
        const newOrderNumber = `STA-${Math.floor(Math.random() * 90000) + 10000}`;
        setOrderNumber(newOrderNumber);
        setCurrentStep(3);
        window.scrollTo(0, 0);
    };

    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleDiscountApplied = (discountValue) => {
        setOutfitDetails(prev => ({
            ...prev,
            discountAmount: discountValue,
        }));
    };

    const renderStepComponent = () => {
        switch (currentStep) {
            case 1:
                return <ShippingStep initialData={shippingData} onSubmit={handleShippingSubmit} />;
            case 2:
                return (
                    <PaymentStep
                        initialData={paymentData}
                        onSubmit={handlePaymentSubmit}
                        onBack={goToPreviousStep}
                        outfit={outfitDetails} // Passa outfitDetails aggiornato
                    />
                );
            case 3:
                return (
                    <ConfirmationStep
                        orderNumber={orderNumber}
                        shippingData={shippingData} // shippingData include selectedShippingOption
                        paymentData={paymentData} // Passa i dati di pagamento
                        outfit={outfitDetails} // Passa outfitDetails aggiornato
                    />
                );
            default:
                return <ShippingStep initialData={shippingData} onSubmit={handleShippingSubmit} />;
        }
    };

    const progress = Math.min((currentStep / 3) * 100, 100);
    const showSidebar = currentStep === 1 || currentStep === 2;
    const stepLabels = ["Spedizione", "Pagamento", "Conferma"];

    return (
        <div className="checkout-page-background">
            <Container className="checkout-main-container my-4 my-md-5">
                 <Row className="justify-content-center mb-4">
                    <Col md={10} lg={8}>
                        <div className="checkout-header-wrapper">
                            <div className="checkout-logo">
                                <span className="logo-st">st</span><span className="logo-ai">AI</span><span className="logo-llist">llist</span>
                            </div>
                            <h2 className="checkout-main-title">Procedura di Acquisto</h2>
                        </div>
                        {currentStep <= 2 && (
                            <div className={`progress-wrapper mx-auto mb-4`}>
                                <ProgressBar
                                    now={progress}
                                    variant="checkout-progress"
                                    aria-label={`Progresso: Step ${currentStep} di 3 - ${stepLabels[currentStep-1]}`}
                                />
                            </div>
                        )}
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col md={showSidebar ? 7 : 10} lg={showSidebar ? 7 : (currentStep === 3 ? 8 : 10)} className="checkout-form-col mb-4 mb-md-0">
                        <div className={`checkout-step-content-wrapper ${currentStep === 3 ? 'confirmation-wrapper confirmation-card' : ''}`}>
                            {renderStepComponent()}
                        </div>
                    </Col>

                    {showSidebar && (
                        <Col md={5} lg={5} className="checkout-sidebar-col">
                            <OrderSummarySidebar
                                outfit={initialOutfitDetails} // Passa i dati base dell'outfit
                                shippingOption={shippingData.selectedShippingOption} // Passa l'opzione di spedizione scelta
                                onDiscountApply={handleDiscountApplied} // Funzione per gestire lo sconto
                            />
                        </Col>
                    )}
                </Row>
                <footer className="checkout-app-footer">
                    <p>© {new Date().getFullYear()} stAllist - Tutti i diritti riservati.</p>
                </footer>
            </Container>
        </div>
    );
};

export default CheckoutProcess;