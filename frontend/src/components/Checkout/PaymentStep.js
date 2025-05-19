import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner, InputGroup } from 'react-bootstrap'; // Aggiunto Spinner, InputGroup
import { FaArrowLeft, FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal, FaCreditCard } from 'react-icons/fa'; // Aggiunte icone

// Funzione per formattare numero carta
const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,19}/g); // Supporta fino a 19 cifre, raggruppa per 4
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
        return parts.join(' ');
    }
    return value;
};

// Funzione per identificare il tipo di carta (semplificata)
const getCardType = (cardNumber) => {
    const num = cardNumber.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return null;
};

const PaymentStep = ({ initialData, onSubmit, onBack, outfit }) => {
    const [formData, setFormData] = useState(initialData);
    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cardType, setCardType] = useState(null);
    const [activePaymentMethod, setActivePaymentMethod] = useState('card'); // 'card', 'paypal', ecc.

    useEffect(() => {
        setFormData(initialData);
        if (initialData.cardnumber) {
            setCardType(getCardType(initialData.cardnumber));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === "cardnumber") {
            processedValue = value.replace(/\D/g, '').slice(0, 19); // Pulisce e limita
            setCardType(getCardType(processedValue)); // Aggiorna il tipo di carta
            // La formattazione con spazi la applichiamo solo per la visualizzazione
        } else if (name === "cvv") {
            processedValue = value.replace(/\D/g, '').slice(0, 4);
        } else if (name === "expiry") {
            let formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 2) {
                formattedValue = formattedValue.slice(0,2) + '/' + formattedValue.slice(2,4);
            }
            processedValue = formattedValue.slice(0,5);
        }
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (activePaymentMethod !== 'card') { // Se si sceglie PayPal (simulato)
            setIsLoading(true);
            console.log(`Procedendo con ${activePaymentMethod}...`);
            setTimeout(() => {
                // In una vera app, qui ci sarebbe il redirect a PayPal
                // Per la simulazione, consideriamolo un successo e andiamo avanti
                onSubmit({ ...formData, paymentMethod: activePaymentMethod });
                setIsLoading(false);
            }, 2000);
            return;
        }

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
        } else {
            setValidated(true);
            setIsLoading(true);
            setTimeout(() => {
                onSubmit({ ...formData, paymentMethod: 'card' });
                setIsLoading(false);
            }, 1500);
        }
    };

    const renderCardIcon = () => {
        if (cardType === 'visa') return <FaCcVisa size="2em" className="text-primary" />;
        if (cardType === 'mastercard') return <FaCcMastercard size="2em" className="text-danger" />;
        if (cardType === 'amex') return <FaCcAmex size="2em" className="text-success" />;
        return <FaCreditCard size="2em" className="text-muted" />;
    };

    return (
        <div>
            <h3 className="step-title">2. Metodo di Pagamento</h3>

            {/* Selettore Metodo di Pagamento */}
            <div className="mb-4 payment-method-selector">
                <Button
                    variant={activePaymentMethod === 'card' ? 'primary-checkout' : 'outline-secondary-checkout'}
                    onClick={() => setActivePaymentMethod('card')}
                    className="me-2 payment-method-btn"
                    disabled={isLoading}
                >
                    <FaCreditCard className="me-2" /> Carta di Credito/Debito
                </Button>
                <Button
                    variant={activePaymentMethod === 'paypal' ? 'primary-checkout' : 'outline-secondary-checkout'}
                    onClick={() => setActivePaymentMethod('paypal')}
                    className="payment-method-btn"
                    disabled={isLoading}
                >
                    <FaPaypal className="me-2" /> PayPal
                </Button>
                {/* Aggiungi altri bottoni per altri metodi se necessario */}
            </div>


            {activePaymentMethod === 'card' && (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formCardholder">
                        <Form.Label>Titolare Carta</Form.Label>
                        <Form.Control
                            type="text"
                            name="cardholder"
                            value={formData.cardholder}
                            onChange={handleChange}
                            required
                            placeholder="MARIO ROSSI"
                            disabled={isLoading}
                        />
                        <Form.Control.Feedback type="invalid">Inserisci il nome del titolare.</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formCardNumber">
                        <Form.Label>Numero Carta</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                inputMode="numeric"
                                name="cardnumber"
                                value={formatCardNumber(formData.cardnumber || '')} // Applica formattazione per display
                                onChange={handleChange} // handleChange si occuperà di pulire e salvare il valore grezzo
                                pattern="[0-9\s]{15,23}" // Pattern per numero con spazi (13-19 cifre + spazi)
                                required
                                placeholder="•••• •••• •••• ••••"
                                disabled={isLoading}
                                maxLength={23} // 19 cifre + 4 spazi max
                            />
                            <InputGroup.Text>{renderCardIcon()}</InputGroup.Text>
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">Numero carta non valido.</Form.Control.Feedback>
                    </Form.Group>

                    <Row className="mb-4">
                        <Col xs={7} sm={8} md={7}>
                            <Form.Group controlId="formExpiry">
                                <Form.Label>Scadenza</Form.Label>
                                <Form.Control
                                    type="text"
                                    inputMode="numeric"
                                    name="expiry"
                                    value={formData.expiry}
                                    onChange={handleChange}
                                    pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                                    required
                                    placeholder="MM/AA"
                                    disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">Formato MM/AA non valido.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={5} sm={4} md={5}>
                            <Form.Group controlId="formCvv">
                                <Form.Label>CVV</Form.Label>
                                <Form.Control
                                    type="text"
                                    inputMode="numeric"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    pattern="[0-9]{3,4}"
                                    required
                                    placeholder="•••"
                                    disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">CVV non valido (3-4 cifre).</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            )}

            {activePaymentMethod === 'paypal' && (
                <div className="text-center p-4 border rounded bg-light">
                    <FaPaypal size="3em" className="mb-3 text-primary" />
                    <p>Verrai reindirizzato a PayPal per completare il pagamento in modo sicuro.</p>
                    {/* Non serve un form qui, il bottone "Paga" generale gestirà l'azione */}
                </div>
            )}

            <Row className="mt-4 pt-2 border-top">
                <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                    <Button variant="secondary-checkout" onClick={onBack} className="w-100 btn-lg-checkout" disabled={isLoading}>
                        <FaArrowLeft className="me-2" /> Indietro
                    </Button>
                </Col>
                <Col xs={12} sm={6}>
                    <Button variant="primary-checkout" type="submit" onClick={handleSubmit} className="w-100 btn-lg-checkout" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                {activePaymentMethod === 'paypal' ? 'Attendere...' : `Pagamento...`}
                            </>
                        ) : (
                            activePaymentMethod === 'paypal' ? `Continua con PayPal` : `Paga ${outfit.currency}${(outfit.totalPrice + (outfit.shippingCost || 0) - (outfit.discountAmount || 0)).toFixed(2)}`
                        )}
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default PaymentStep;