// src/components/ConfirmationStep.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, ListGroup, Alert, Row, Col } from 'react-bootstrap'; // Rimosso 'Image' dagli import
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShippingFast, FaCreditCard, FaPaypal } from 'react-icons/fa';

import { clearCart } from '../redux/reducers/cartReducer';
import { markAsSold } from '../redux/reducers/imagesSliceReducer';
import { resetCheckout } from '../redux/reducers/checkoutReducer'; // Assicurati che il percorso sia corretto

const ConfirmationStep = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orderNumber, shippingData, paymentData, outfitDetails } = useSelector(state => state.checkout);

  // Estrai i valori necessari con fallback per robustezza
  const itemsToDisplay = outfitDetails?.items || [];
  const subtotal = outfitDetails?.totalPrice || 0;
  const shippingCost = outfitDetails?.shippingCost || 0;
  const discountAmount = outfitDetails?.discountAmount || 0;
  const totalPaid = subtotal + shippingCost - discountAmount;
  const currency = outfitDetails?.currency || '€';
  const outfitName = outfitDetails?.name || 'Riepilogo Ordine'; 
  const isSingleItemWithSpecificName = outfitDetails?.isSingleItemWithSpecificName || false;

  useEffect(() => {
    // Marca come venduto e svuota il carrello
    if (orderNumber && itemsToDisplay.length > 0) {
      itemsToDisplay.forEach(item => {
        if (item && item.id_image) {
          dispatch(markAsSold(item.id_image));
        }
      });
      dispatch(clearCart());
    }

    // Cleanup: resetta lo stato del checkout quando il componente viene smontato
    return () => {
      if (orderNumber) { // Solo se un ordine è stato effettivamente processato
        if (typeof resetCheckout === 'function') {
          dispatch(resetCheckout());
        }
      }
    };
  }, [dispatch, itemsToDisplay, orderNumber]); // Dipendenze dell'effect

  // Funzioni helper per i dettagli di pagamento
  const getPaymentMethodName = () => {
    if (paymentData?.paymentMethod === 'paypal') return 'PayPal';
    if (paymentData?.paymentMethod === 'card') return 'Carta di Credito/Debito';
    return 'Non specificato';
  };

  const getPaymentIcon = () => {
    if (paymentData?.paymentMethod === 'paypal') return <FaPaypal className="me-1" />;
    if (paymentData?.paymentMethod === 'card') return <FaCreditCard className="me-1" />;
    return null;
  };

  const handleReturnToHome = () => {
    navigate('/');
  };

  // UI di fallback se i dati dell'ordine non sono pronti o validi
  if (!orderNumber || !outfitDetails || !outfitDetails.items || itemsToDisplay.length === 0) {
    return (
      <div className="text-center mt-5">
        <Alert variant="warning">Informazioni sull'ordine non disponibili o sessione scaduta.</Alert>
        <Button variant="primary" onClick={handleReturnToHome}>
          <FaHome className="me-2" /> Torna alla Homepage
        </Button>
      </div>
    );
  }
  
  // Render principale della pagina di conferma
  return (
    <div className="text-center">
      <div className="confirmation-icon mb-3">
        <FaCheckCircle size={70} className="text-success-checkout" />
      </div>
      <h3 className="step-title text-success-checkout mb-2">Ordine Confermato!</h3>
      <p className="lead">Grazie per il tuo acquisto su stAllist.</p>

      <Alert variant="light-checkout-info" className="text-start mt-4 mb-4">
        <p className="mb-1"><strong>Numero Ordine:</strong> {orderNumber}</p>
        <p className="mb-0">Riceverai un'email di conferma all'indirizzo <strong>{shippingData?.email || 'N/D'}</strong>.</p>
      </Alert>

      <Card className="text-start order-details-card">
        <Card.Header as="h5" className="order-details-header">Dettagli dell'Ordine</Card.Header>
        <Card.Body>
          {/* L'immagine principale dell'outfit è stata rimossa */}

          <h6 className="details-section-title mt-2">
            {outfitName} {/* Nome dinamico: "Nome Articolo Specifico" o "Selezione di X Articoli" */}
          </h6>
          
          {/* Mostra la lista dettagliata se sono più item OPPURE se è un singolo item MA il nome dell'outfit è generico */}
          {(!isSingleItemWithSpecificName || itemsToDisplay.length > 1) ? (
            <ListGroup variant="flush" className="mb-2 order-details-items">
              {itemsToDisplay.map((item, index) => {
                let displayContent = `Articolo ${index + 1} (dettagli non disponibili)`;
                // Usa item.id_image per la key se disponibile, altrimenti l'indice
                let itemKey = (item && typeof item.id_image !== 'undefined') ? item.id_image : `confirm-item-idx-${index}`;

                if (item) { // Ulteriore controllo che item esista
                    if (typeof item.description === 'string' && item.description.trim() !== '') {
                    displayContent = item.description;
                    } else if (typeof item.name === 'string' && item.name.trim() !== '') {
                    displayContent = item.name; // Fallback al nome se la descrizione non è utile
                    } else if (typeof item.id_image !== 'undefined') {
                        displayContent = `Articolo (ID: ${item.id_image})`;
                    }
                }
                
                return (
                  <ListGroup.Item key={itemKey} className="py-2 px-0">
                    {displayContent}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          ) : (
            // Caso: Singolo articolo E il nome dell'outfit è già specifico per quell'articolo.
            // Mostra un messaggio placeholder o nulla.
            itemsToDisplay.length === 1 && ( 
                <div className="text-muted small py-2 px-0 mb-2"> {/* Aggiunto mb-2 per coerenza */}
                    <em>(Dettagli articolo come da titolo)</em>
                </div>
            )
          )}

          <hr className="my-3" />

          <h6 className="details-section-title">Riepilogo Costi:</h6>
          <ListGroup variant="flush" className="summary-details-list mb-2">
            <ListGroup.Item className="d-flex justify-content-between px-0">
              <span>Subtotale Prodotti:</span>
              <span className="fw-medium">{currency}{subtotal.toFixed(2)}</span>
            </ListGroup.Item>
            {shippingData?.selectedShippingOption && (
              <ListGroup.Item className="d-flex justify-content-between px-0">
                <span>Spedizione <span className="text-muted small">({shippingData.selectedShippingOption.name || 'N/D'})</span>:</span>
                <span className="fw-medium">{shippingCost > 0 ? `${currency}${shippingCost.toFixed(2)}` : 'Gratuita'}</span>
              </ListGroup.Item>
            )}
            {discountAmount > 0 && (
              <ListGroup.Item className="d-flex justify-content-between text-success px-0">
                <span>Sconto Applicato:</span> {/* Potresti voler mostrare il codice qui se lo salvi */}
                <span className="fw-medium">-{currency}{discountAmount.toFixed(2)}</span>
              </ListGroup.Item>
            )}
          </ListGroup>
          <p className="order-details-total mt-2"><strong>Totale Pagato:</strong> <span className="h5 mb-0 fw-bold">{currency}{totalPaid.toFixed(2)}</span></p>

          <hr className="my-3" />

          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <h6 className="details-section-title">Indirizzo di Spedizione:</h6>
              {shippingData && Object.keys(shippingData).length > 0 ? (
                <address className="shipping-address-details mb-0">
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
              ) : <p>Indirizzo di spedizione non specificato.</p>}
            </Col>
            <Col md={6}>
              <h6 className="details-section-title">Metodo di Pagamento:</h6>
              {paymentData && Object.keys(paymentData).length > 0 ? (
                <p className="payment-method-details mb-0">
                  {getPaymentIcon()} {getPaymentMethodName()}
                  {paymentData.paymentMethod === 'card' && paymentData.cardnumber && (
                    <span className="text-muted d-block small">
                      Terminante con •••• {paymentData.cardnumber.slice(-4)}
                    </span>
                  )}
                </p>
              ) : <p>Metodo di pagamento non specificato.</p>}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Button as={Link} to="/" variant="primary-checkout" size="lg" className="mt-4 btn-lg-checkout">
        <FaHome className="me-2" /> Torna alla Homepage
      </Button>
    </div>
  );
};

export default ConfirmationStep;