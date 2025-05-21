import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  FaTimes,
  FaHeart,
  FaBookmark,
  FaShoppingCart,
  FaUserCircle
} from 'react-icons/fa';
import './ImageModal.css';

const ImageModal = ({ imageUrl, imageDetails, onClose }) => {
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

  if (!imageUrl) return null;

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
            src={imageUrl}
            alt="Outfit ingrandito"
            className="image-modal-img-v2"
          />
        </div>

        <div className="image-modal-details-v2">
          {/* Profilo */}
          <div className="modal-user-info">
            {imageDetails?.avatarUrl ? (
              <img
                src={imageDetails.avatarUrl}
                alt="Avatar"
                className="modal-user-icon"
              />
            ) : (
              <FaUserCircle size={28} className="modal-user-icon" />
            )}
            <span>{imageDetails?.user || 'Utente Sconosciuto'}</span>
          </div>

          {/* Descrizione */}
          {imageDetails?.description && (
            <p className="modal-description">
              <span className="username-bold">
                {imageDetails.user || 'Utente'}
              </span>{' '}
              {imageDetails.description}
            </p>
          )}

          {/* Azioni */}
          <div className="modal-actions">
            <button className="modal-action-btn">
              <FaHeart
                className={imageDetails?.isLiked ? 'liked' : ''}
                style={{ marginRight: '6px' }}
              />
              <span>
                Mi piace ({imageDetails?.likes || 0})
              </span>
            </button>

            <button className="modal-action-btn">
              <FaBookmark style={{ marginRight: '6px' }} />
              <span>Salva</span>
            </button>

            <button className="modal-action-btn">
              <FaShoppingCart style={{ marginRight: '6px' }} />
              <span>Acquista</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default ImageModal;
