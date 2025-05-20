import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Image, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/reducers/cartReducer';
import { markAsSold } from '../redux/reducers/imagesSliceReducer';
import { setOutfitFromCart } from '../redux/reducers/checkoutReducer';
import { useNavigate } from 'react-router-dom';

const CartModal = ({ show, handleClose }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

  useEffect(() => {
    if (!show) {
      setPurchaseComplete(false);
      setShowConfirm(false);
    }
  }, [show]);

  const handlePurchaseConfirm = () => {
    cartItems.forEach(item => dispatch(markAsSold(item.id_image)));
    dispatch(clearCart());
    setPurchaseComplete(true);
    setShowConfirm(false);
  };

  const handlePurchase = () => {
    dispatch(setOutfitFromCart(cartItems));
    handleClose();
    navigate('/checkout');
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Carrello</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {purchaseComplete && (
          <Alert variant="success" className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill me-2"></i>
            Acquisto effettuato con successo!
          </Alert>
        )}

        {!purchaseComplete && cartItems.length > 0 && (
          <Table responsive>
            <thead>
              <tr>
                <th>Immagine</th>
                <th>Descrizione</th>
                <th>Prezzo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id_image}>
                  <td>
                    <Image src={item.uri} alt="item" width={60} height={60} rounded />
                  </td>
                  <td>{item.description}</td>
                  <td>{item.price} €</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => dispatch(removeFromCart(item.id_image))}
                    >
                      Rimuovi
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {!purchaseComplete && cartItems.length === 0 && <p>Il carrello è vuoto.</p>}

        {showConfirm && (
          <div className="border rounded p-3 mt-3 bg-light">
            <p className="mb-3">Confermi l'acquisto dei prodotti nel carrello?</p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>Annulla</Button>
              <Button variant="success" onClick={handlePurchaseConfirm}>Sì, conferma</Button>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-end">
        {!purchaseComplete && cartItems.length > 0 && !showConfirm && (
          <>
            <strong className="me-auto">Totale: {total} €</strong>
            <Button variant="success" onClick={handlePurchase}>
              Procedi all'acquisto
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={handleClose}>Chiudi</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;