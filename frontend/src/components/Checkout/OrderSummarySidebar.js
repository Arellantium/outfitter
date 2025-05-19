import React, { useState } from 'react';
import { Card, ListGroup, Image, Form, Button, InputGroup, Alert } from 'react-bootstrap';

const OrderSummarySidebar = ({ outfit, shippingOption, onDiscountApply }) => {
    // MODIFICATO: Spostati gli hook useState all'inizio del componente
    const [discountCode, setDiscountCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(null); // { amount: number, code: string, message: string }
    const [discountError, setDiscountError] = useState('');

    // Il controllo su outfit ora viene dopo la dichiarazione degli hook
    if (!outfit) return null;

    const subtotal = outfit.totalPrice;
    const shippingCost = shippingOption ? shippingOption.price : 0;
    let discountAmount = discountApplied ? discountApplied.amount : 0;

    const total = subtotal + shippingCost - discountAmount;

    const handleApplyDiscount = () => {
        setDiscountError('');
        // Non resettare discountApplied qui se vuoi che lo sconto rimanga visibile
        // a meno che non venga inserito un nuovo codice valido o vuoto.
        // Per ora, lo lascio così, ma potresti voler cambiare logica.
        // setDiscountApplied(null); 

        if (discountCode.toUpperCase() === 'STALLIST10') {
            const discountValue = subtotal * 0.10; // 10% di sconto
            setDiscountApplied({
                amount: discountValue,
                code: discountCode.toUpperCase(),
                message: `Sconto "${discountCode.toUpperCase()}" applicato!`
            });
            if (onDiscountApply) onDiscountApply(discountValue);
            setDiscountCode('');
        } else if (discountCode.trim() === '') {
            setDiscountError('Inserisci un codice sconto.');
            // Se inserisci un codice vuoto, potresti voler rimuovere uno sconto precedentemente applicato
            if (discountApplied && onDiscountApply) onDiscountApply(0); // Resetta lo sconto
            setDiscountApplied(null); // Rimuovi lo sconto visualizzato
        }
        else {
            setDiscountError('Codice sconto non valido.');
            if (onDiscountApply) onDiscountApply(0); // Resetta lo sconto
            setDiscountApplied(null); // Rimuovi lo sconto visualizzato
        }
    };


    return (
        <Card className="order-summary-sidebar sticky-top">
            <Card.Header as="h5" className="sidebar-header">
                Riepilogo Ordine
            </Card.Header>
            {outfit.imageUrl && (
                <div className="outfit-image-container">
                    <Image src={outfit.imageUrl} alt={outfit.name} className="outfit-sidebar-image" />
                </div>
            )}
            <Card.Body>
                <Card.Title as="h6" className="sidebar-outfit-name">{outfit.name}</Card.Title>
                <ListGroup variant="flush" className="sidebar-items-list mb-3">
                    {outfit.items.map((item, index) => (
                        <ListGroup.Item key={index}>{item}</ListGroup.Item>
                    ))}
                </ListGroup>

                {/* Dettaglio Costi */}
                <ListGroup variant="flush" className="summary-details-list mb-3">
                    <ListGroup.Item className="d-flex justify-content-between">
                        <span>Subtotale:</span>
                        <span>{outfit.currency}{subtotal.toFixed(2)}</span>
                    </ListGroup.Item>
                    {shippingOption && (
                        <ListGroup.Item className="d-flex justify-content-between">
                            <span>Spedizione ({shippingOption.name}):</span>
                            <span>
                                {shippingCost > 0 ? `${outfit.currency}${shippingCost.toFixed(2)}` : 'Gratuita'}
                            </span>
                        </ListGroup.Item>
                    )}
                    {discountApplied && (
                         <ListGroup.Item className="d-flex justify-content-between text-success">
                            <span>Sconto ({discountApplied.code}):</span>
                            <span>-{outfit.currency}{discountApplied.amount.toFixed(2)}</span>
                        </ListGroup.Item>
                    )}
                </ListGroup>

                {/* Codice Sconto */}
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="discount-code-input" className="visually-hidden">Codice Sconto</Form.Label>
                    <InputGroup>
                        <Form.Control
                            id="discount-code-input"
                            type="text"
                            placeholder="Codice Sconto"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            aria-describedby="discount-feedback"
                        />
                        <Button variant="outline-secondary" onClick={handleApplyDiscount}>
                            Applica
                        </Button>
                    </InputGroup>
                    {discountApplied && <Alert variant="success" className="mt-2 py-1 px-2 small" id="discount-feedback" role="alert">{discountApplied.message}</Alert>}
                    {discountError && <Alert variant="danger" className="mt-2 py-1 px-2 small" id="discount-feedback" role="alert">{discountError}</Alert>}
                </Form.Group>


                <div className="sidebar-total-section">
                    <span className="total-label">Totale:</span>
                    <span className="total-amount">
                        {outfit.currency}{total.toFixed(2)}
                    </span>
                </div>
            </Card.Body>
             <Card.Footer className="sidebar-footer">
                Tutti i prezzi includono IVA (se applicabile).
            </Card.Footer>
        </Card>
    );
};

export default OrderSummarySidebar;