import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { applyDiscount } from '../redux/reducers/checkoutReducer';
import { Card, ListGroup, Image, Form, Button, InputGroup, Alert } from 'react-bootstrap';

const OrderSummarySidebar = () => {
  const dispatch = useDispatch();
  const { outfitDetails, shippingData } = useSelector(state => state.checkout);

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(null);
  const [discountError, setDiscountError] = useState('');

  if (!outfitDetails) return null;

  const subtotal = outfitDetails.totalPrice;
  const shippingCost = shippingData.selectedShippingOption?.price || 0;
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
      setDiscountError('Codice sconto non valido.');
      setDiscountApplied(null);
      dispatch(applyDiscount(0));
    }
  };

  return (
    <Card className="order-summary-sidebar sticky-top">
      <Card.Header as="h5">Riepilogo Ordine</Card.Header>
      {outfitDetails.imageUrl && (
        <div className="outfit-image-container">
          <Image src={outfitDetails.imageUrl} alt={outfitDetails.name} className="outfit-sidebar-image" />
        </div>
      )}
      <Card.Body>
        <Card.Title>{outfitDetails.name}</Card.Title>
        <ListGroup variant="flush" className="mb-3">
          {outfitDetails.items.map((item, i) => <ListGroup.Item key={i}>{item}</ListGroup.Item>)}
        </ListGroup>

        <ListGroup variant="flush" className="mb-3">
          <ListGroup.Item className="d-flex justify-content-between">
            <span>Subtotale:</span>
            <span>{outfitDetails.currency}{subtotal.toFixed(2)}</span>
          </ListGroup.Item>
          {shippingData.selectedShippingOption && (
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Spedizione:</span>
              <span>{shippingCost > 0 ? `${outfitDetails.currency}${shippingCost.toFixed(2)}` : 'Gratuita'}</span>
            </ListGroup.Item>
          )}
          {discountApplied && (
            <ListGroup.Item className="d-flex justify-content-between text-success">
              <span>Sconto:</span>
              <span>-{outfitDetails.currency}{discountApplied.amount.toFixed(2)}</span>
            </ListGroup.Item>
          )}
        </ListGroup>

        <Form.Group className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Codice Sconto"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <Button onClick={handleApplyDiscount}>Applica</Button>
          </InputGroup>
          {discountApplied && <Alert variant="success" className="mt-2">{discountApplied.message}</Alert>}
          {discountError && <Alert variant="danger" className="mt-2">{discountError}</Alert>}
        </Form.Group>

        <div className="sidebar-total-section d-flex justify-content-between">
          <strong>Totale:</strong>
          <span>{outfitDetails.currency}{total.toFixed(2)}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderSummarySidebar;
