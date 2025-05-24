import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  FaTimes,
  FaHeart,
  FaBookmark,
  FaShoppingCart,
  FaUserCircle
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../redux/reducers/imagesSliceReducer';
import './ImageModal.css';
import { addToCart, removeFromCart } from '../redux/reducers/cartReducer';

const ImageModal = ({ imageId, onClose }) => {
  const dispatch = useDispatch();

  // 🔥 Prendi l'immagine aggiornata dallo store
  const image = useSelector((state) =>
    state.images.images.find((img) => img.id_image === imageId)
  );

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  if (!image) return null;

  const handleToggleLike = () => {
    dispatch(toggleLike(image.id_image));
  };

  const isInCart = cartItems.some(item => String(item.id_image) === String(image.id_image));
  const handleToggleCart = () => {
    if (isInCart) dispatch(removeFromCart(image.id_image));
    else dispatch(addToCart(image));
  };

  return ReactDOM.createPortal(
    <div className="image-modal-backdrop-v2" onClick={onClose}>
      <div
        className="image-modal-content-v2"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="image-modal-close-btn-v2" onClick={onClose}>
          <FaTimes size={20} />
        </button>

        <div className="image-modal-image-container-v2">
          <img
            src={image.uri}
            alt="Outfit ingrandito"
            className="image-modal-img-v2"
          />
        </div>

        <div className="image-modal-details-v2">
          <div className="modal-user-info">
            {image.avatarUrl ? (
              <img
                src={image.avatarUrl}
                alt="Avatar"
                className="modal-user-icon"
              />
            ) : (
              <FaUserCircle size={28} className="modal-user-icon" />
            )}
            <span>{image.user || 'Utente Sconosciuto'}</span>
          </div>

          {image.description && (
            <p className="modal-description">
              <span className="username-bold"></span>{' '}
              {image.description}
            </p>
          )}

          <div className="modal-actions">
            <button
              className={`modal-action-btn ${image.like ? 'liked' : ''}`}
              onClick={handleToggleLike}
            >
              <FaHeart style={{ marginRight: '6px' }} />
              <span>Mi piace {image.likes_count > 0 ? `(${image.likes_count})` : ''}</span>
            </button>

            <button className="modal-action-btn" hidden>
              <FaBookmark style={{ marginRight: '6px' }} />
              <span>Salva</span>
            </button>

            <button className={`modal-action-btn ${isInCart ? 'likedButton' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleToggleCart(); }}>
              <FaShoppingCart style={{ marginRight: '6px' }} />
              <span>{isInCart ? 'Rimuove Carrello' : 'Acquista'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default ImageModal;
