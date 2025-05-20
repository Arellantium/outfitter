import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, ListGroup, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShippingFast, FaCreditCard, FaPaypal } from 'react-icons/fa';

const ConfirmationStep = () => {
  const { orderNumber, shippingData, paymentData, outfitDetails } = useSelector(state => state.checkout);

  const subtotal = outfitDetails.totalPrice;
  const shippingCost = outfitDetails.shippingCost || 0;
  const discountAmount = outfitDetails.discountAmount || 0;
  const totalPaid = subtotal + shippingCost - discountAmount;

  const getPaymentMethodName = () => {
    if (paymentData.paymentMethod === 'paypal') return 'PayPal';
    if (paymentData.paymentMethod === 'card') return 'Carta di Credito/Debito';
    return 'Non specificato';
  };

  const getPaymentIcon = () => {
    if (paymentData.paymentMethod === 'paypal') return <FaPaypal className="me-1" />;
    if (paymentData.paymentMethod === 'card') return <FaCreditCard className="me-1" />;
    return null;
  };

  return (
    <div className="text-center">
      <div className="confirmation-icon mb-3">
        <FaCheckCircle size={70} className="text-success-checkout" />
      </div>
      <h3 className="step-title text-success-checkout mb-2">Ordine Confermato!</h3>
      <p className="lead">Grazie per il tuo acquisto su stAllist.</p>

      <Alert variant="light-checkout-info" className="text-start mt-4 mb-4">
        <p className="mb-1"><strong>Numero Ordine:</strong> {orderNumber}</p>
        <p className="mb-0">Riceverai un'email di conferma all'indirizzo <strong>{shippingData.email}</strong>.</p>
      </Alert>

      <Card className="text-start order-details-card">
        <Card.Header as="h5" className="order-details-header">Dettagli dell'Ordine</Card.Header>
        <Card.Body>
          <h6 className="details-section-title">Outfit Acquistato:</h6>
          <p className="mb-1"><strong>{outfitDetails.name}</strong></p>
          <ListGroup variant="flush" className="mb-2 order-details-items">
            {outfitDetails.items.map((item, index) => (
              <ListGroup.Item key={index}>{item}</ListGroup.Item>
            ))}
          </ListGroup>

          <hr className="my-3" />

          <h6 className="details-section-title">Riepilogo Costi:</h6>
          <ListGroup variant="flush" className="summary-details-list mb-2">
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Subtotale Prodotti:</span>
              <span>{outfitDetails.currency}{subtotal.toFixed(2)}</span>
            </ListGroup.Item>
            {shippingData.selectedShippingOption && (
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Spedizione ({shippingData.selectedShippingOption.name}):</span>
                <span>{shippingCost > 0 ? `${outfitDetails.currency}${shippingCost.toFixed(2)}` : 'Gratuita'}</span>
              </ListGroup.Item>
            )}
            {discountAmount > 0 && (
              <ListGroup.Item className="d-flex justify-content-between text-success">
                <span>Sconto Applicato:</span>
                <span>-{outfitDetails.currency}{discountAmount.toFixed(2)}</span>
              </ListGroup.Item>
            )}
          </ListGroup>
          <p className="order-details-total mt-2"><strong>Totale Pagato:</strong> {outfitDetails.currency}{totalPaid.toFixed(2)}</p>

          <hr className="my-3" />

          <Row>
            <Col md={6}>
              <h6 className="details-section-title">Indirizzo di Spedizione:</h6>
              <address className="shipping-address-details mb-md-0 mb-3">
                {shippingData.fullname}<br />
                {shippingData.address}<br />
                {shippingData.zip} {shippingData.city}<br />
                {shippingData.country === 'IT' ? 'Italia' : shippingData.country}
                {shippingData.selectedShippingOption && (
                  <div className="mt-2 text-muted small">
                    <FaShippingFast className="me-1" />
                    {shippingData.selectedShippingOption.name}
                  </div>
                )}
              </address>
            </Col>
            <Col md={6}>
              <h6 className="details-section-title">Metodo di Pagamento:</h6>
              <p className="payment-method-details">
                {getPaymentIcon()} {getPaymentMethodName()}
                {paymentData.paymentMethod === 'card' && paymentData.cardnumber && (
                  <span className="text-muted d-block small">
                    Terminante con •••• {paymentData.cardnumber.slice(-4)}
                  </span>
                )}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Button as={Link} to="/" variant="primary-checkout" size="lg" className="mt-3 btn-lg-checkout">
        <FaHome className="me-2" /> Torna alla Homepage
      </Button>
    </div>
  );
};

export default ConfirmationStep;
