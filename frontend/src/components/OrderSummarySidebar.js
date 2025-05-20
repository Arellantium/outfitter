// src/components/OrderSummarySidebar.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { applyDiscount } from '../redux/reducers/checkoutReducer';
import { Card, ListGroup, Image, Form, Button, InputGroup, Alert } from 'react-bootstrap';

const OrderSummarySidebar = () => {
  const dispatch = useDispatch();
  const { outfitDetails, shippingData } = useSelector(state => state.checkout);
  // Estrai isSingleItemWithSpecificName direttamente da outfitDetails per semplicità
  const isSingleItemWithSpecificName = outfitDetails?.isSingleItemWithSpecificName || false;

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(null);
  const [discountError, setDiscountError] = useState('');

  if (!outfitDetails || !outfitDetails.items || outfitDetails.items.length === 0) {
    return (
      <Card className="order-summary-sidebar sticky-top">
        <Card.Header as="h5" className="text-center">Riepilogo Ordine</Card.Header>
        <Card.Body>
          <p className="text-muted text-center py-3">Il carrello è vuoto.</p>
        </Card.Body>
      </Card>
    );
  }

  const subtotal = outfitDetails.totalPrice || 0;
  const shippingCost = shippingData?.selectedShippingOption?.price || 0;
  const discountAmount = discountApplied ? discountApplied.amount : 0;
  const total = subtotal + shippingCost - discountAmount;

  const handleApplyDiscount = () => {
    setDiscountError('');
    if (discountCode.toUpperCase() === 'STALLIST10') { 
      const discountValue = subtotal * 0.10; 
      setDiscountApplied({
        amount: discountValue,
        code: discountCode.toUpperCase(),
        message: `Sconto "${discountCode.toUpperCase()}" applicato!`
      });
      dispatch(applyDiscount(discountValue));
      setDiscountCode('');
    } else {
      setDiscountError('Codice sconto non valido o scaduto.');
      setDiscountApplied(null);
      dispatch(applyDiscount(0)); 
    }
  };

  return (
    <Card className="order-summary-sidebar sticky-top">
      <Card.Header as="h5" className="text-center">Riepilogo Ordine</Card.Header>
      
      {/* Mostra l'immagine principale solo se imageUrl è presente (per un singolo item) */}
      {outfitDetails.imageUrl && outfitDetails.items.length === 1 && (
        <div className="p-3 text-center"> {/* Contenitore semplice */}
          <Image 
            src={outfitDetails.imageUrl} 
            alt={outfitDetails.name || 'Immagine Outfit'} 
            fluid // Rende l'immagine responsiva (max-width: 100%, height: auto)
            rounded // Aggiunge angoli arrotondati
            style={{ maxHeight: '180px', width: 'auto', display: 'inline-block' }} // Limita altezza, larghezza auto, centra
          />
        </div>
      )}

      <Card.Body>
        <Card.Title className={`text-center ${(!outfitDetails.imageUrl || outfitDetails.items.length > 1) ? 'mt-0' : ''} mb-3`}> 
          {outfitDetails.name || 'Dettaglio Ordine'}
        </Card.Title>
        
        {/* Sezione Lista Articoli */}
        {outfitDetails.items.length > 0 && (
            // Non mostrare la lista dettagliata se è un singolo item con nome specifico (già nel titolo)
            // Mostrala se sono più item OPPURE se il nome dell'outfit è generico
            (!isSingleItemWithSpecificName || outfitDetails.items.length > 1) ? (
                <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '1rem' }}>
                    <ListGroup variant="flush" className="order-items-summary-list">
                    {outfitDetails.items.map((item, index) => {
                        if (!item) return null;
                        return (
                        <ListGroup.Item key={item.id_image || `summary-item-${index}`} className="d-flex align-items-center py-2 px-0">
                            {item.uri && (
                            <Image 
                                src={item.uri} 
                                alt={item.name || item.description || `Articolo ${index + 1}`} 
                                width={45} 
                                height={45}
                                rounded 
                                className="me-2 flex-shrink-0"
                                style={{ objectFit: 'cover' }} // Mantiene lo stile per le thumbnail
                            />
                            )}
                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                <div className="fw-bold small mb-0 text-truncate">
                                    {item.name || `Articolo ${item.id_image || index + 1}`}
                                </div>
                                {/* Mostra la descrizione per multi-item, o se il nome outfit è generico */}
                                {(outfitDetails.items.length > 1 || !isSingleItemWithSpecificName) && 
                                 typeof item.description === 'string' && 
                                 item.description.trim() !== '' && (
                                    <div className="text-muted" style={{fontSize: '0.75rem', lineHeight: '1.2', maxHeight: '2.4em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                      {item.description}
                                    </div>
                                )}
                            </div>
                        </ListGroup.Item>
                        );
                    })}
                    </ListGroup>
                </div>
            ) : (
                // Caso singolo item con nome specifico: messaggio alternativo
                outfitDetails.items.length === 1 && (
                    <ListGroup variant="flush" className="mb-3">
                        <ListGroup.Item className="py-2 px-0 text-muted small text-center">
                            <em>(Articolo singolo, dettagli nel titolo)</em>
                        </ListGroup.Item>
                    </ListGroup>
                )
            )
        )}
        
        <ListGroup variant="flush" className="mb-3 cost-summary-list">
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span>Subtotale:</span>
            <span className="fw-medium">{outfitDetails.currency || '€'}{subtotal.toFixed(2)}</span>
          </ListGroup.Item>
          {shippingData?.selectedShippingOption && (
            <ListGroup.Item className="d-flex justify-content-between px-0">
              <span>Spedizione <span className="text-muted small">({shippingData.selectedShippingOption.name || 'N/D'})</span>:</span>
              <span className="fw-medium">{shippingCost > 0 ? `${outfitDetails.currency || '€'}${shippingCost.toFixed(2)}` : 'Gratuita'}</span>
            </ListGroup.Item>
          )}
          {discountApplied && (
            <ListGroup.Item className="d-flex justify-content-between text-success px-0">
              <span>Sconto <span className="text-muted small">({discountApplied.code})</span>:</span>
              <span className="fw-medium">-{outfitDetails.currency || '€'}{discountApplied.amount.toFixed(2)}</span>
            </ListGroup.Item>
          )}
        </ListGroup>

        <Form.Group className="mb-3 discount-form-group">
          <Form.Label htmlFor={`discount-code-sidebar-${Date.now()}`} className="visually-hidden">Codice Sconto</Form.Label>
          <InputGroup>
            <Form.Control
              id={`discount-code-sidebar-${Date.now()}`}
              type="text"
              placeholder="Codice Sconto"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              aria-label="Codice Sconto"
            />
            <Button 
              variant="primary" 
              onClick={handleApplyDiscount}
              disabled={!discountCode.trim()}
            >
              Applica
            </Button>
          </InputGroup>
          {discountApplied && <Alert variant="success" className="mt-2 py-2 small fade show">{discountApplied.message}</Alert>}
          {discountError && <Alert variant="danger" className="mt-2 py-2 small fade show">{discountError}</Alert>}
        </Form.Group>

        <div className="sidebar-total-section d-flex justify-content-between fw-bold border-top pt-3 mt-3">
          <strong className="h5 mb-0">Totale Ordine:</strong>
          <span className="h5 mb-0 text-primary-emphasis">{outfitDetails.currency || '€'}{total.toFixed(2)}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderSummarySidebar;