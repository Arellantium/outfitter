import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Badge } from 'react-bootstrap';
import CartModal from './CartModal'; // 👉 Assicurati che il percorso sia corretto

const CartIconWithBadge = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.length;

  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = () => setShowModal(!showModal);

  return (
    <>
      <div className="position-relative" onClick={handleToggleModal} style={{ cursor: 'pointer' }}>
        <FaShoppingCart size={18} className="nav-icon" />
        {itemCount > 0 && (
          <Badge
            pill
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.65rem' }}
          >
            {itemCount}
          </Badge>
        )}
      </div>

      <CartModal show={showModal} handleClose={handleToggleModal} />
    </>
  );
};

export default CartIconWithBadge;
