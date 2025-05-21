// src/components/PhotoGrid.js
import React, { useState, useEffect, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import './PhotoGrid.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import ImageModal from './ImageModal'; // <-- IMPORTA IL NUOVO COMPONENTE
import {
  fetchImagesStart,
  fetchImagesSuccess,
  fetchImagesError,
  toggleLike
} from '../redux/reducers/imagesSliceReducer';
import { addToCart, removeFromCart } from '../redux/reducers/cartReducer';

const PhotoGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imageToView, setImageToView] = useState(null); // Stato per l'immagine da passare al modal
  // NOTA: Ho rinominato selectedImage in imageToView per chiarezza,
  // dato che il modal stesso gestirà la logica di "selezione" interna se necessario.

  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.loading);
  const error = useSelector((state) => state.images.error);
  const cartItems = useSelector((state) => state.cart.items);
  const imagesAlreadyLoaded = images && images.length > 0;

  const fetchImages = useCallback(async () => {
    if (imagesAlreadyLoaded) return;
    try {
      dispatch(fetchImagesStart());
      const allImagesData = require('../mock/allImages.json');
      await new Promise((r) => setTimeout(r, 500));
      dispatch(fetchImagesSuccess(allImagesData));
    } catch (err) {
      dispatch(fetchImagesError(err.message));
    }
  }, [dispatch, imagesAlreadyLoaded]);

  useEffect(() => {
    if (!imagesAlreadyLoaded) {
      fetchImages();
    }
  }, [fetchImages, imagesAlreadyLoaded]);

  const handleToggleLike = (id_image) => {
    dispatch(toggleLike(id_image));
  };
  const handleNavigateToCreatePost = () => navigate('/create-post');

  const openModalWithImage = (imageObject) => { // Ora passiamo l'intero oggetto immagine
    console.log('DEBUG: openModalWithImage CALLED with:', imageObject);
    setImageToView(imageObject);
  };

  const closeModal = () => {
    console.log('DEBUG: closeModal CALLED.');
    setImageToView(null);
  };

  const breakpointColumnsObj = { default: 3, 1100: 3, 992: 2, 700: 2, 576: 1 };

  if (loading && !imagesAlreadyLoaded) return <div className="loading text-center mt-5 py-5">Caricamento immagini...</div>;
  if (error) return <div className="text-danger text-center mt-5 py-5">Errore nel caricamento: {error}</div>;
  if (!loading && !imagesAlreadyLoaded && !error) return <div className="text-center mt-5 py-5">Nessuna immagine da visualizzare.</div>;

  return (
    <div className="photo-grid-wrapper container-fluid-equivalent px-2 px-sm-3 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="latest-looks-title">Latest Looks</h2>
        <button className="btn-custom-upload" onClick={handleNavigateToCreatePost}>
          <FaPlusCircle size="1.1em" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Carica Post
        </button>
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((img) => {
          if (!img || typeof img.id_image === 'undefined') return null;

          const isInCart = cartItems.some(item => String(item.id_image) === String(img.id_image));
          const handleToggleCart = () => {
            if (isInCart) { dispatch(removeFromCart(img.id_image)); }
            else { dispatch(addToCart(img)); }
          };

          return (
            // Struttura card più sicura per il click
            <div key={`card-${img.id_image}`} className="masonry-item">
              <div
                className={`card-image-clickable-area ${img.sold ? 'sold' : ''}`}
                onClick={() => {
                  console.log('DEBUG onClick: CARD AREA CLICKED - Image:', img);
                  if (!img.sold) {
                    openModalWithImage(img); // Passa l'intero oggetto img
                  }
                }}
                style={{ cursor: img.sold ? 'default' : 'pointer' }}
              >
                {img.sold && <div className="sold-badge">VENDUTO</div>}
                <img
                  src={img.uri}
                  alt={img.description || `Immagine ${img.id_image}`}
                  className="card-img-top-masonry" // Nuova classe per lo stile
                />
                {/* L'overlay è separato e posizionato sopra l'immagine con CSS */}
                {!img.sold && (
                  <div className="card-image-overlay"> {/* Nuova classe per l'overlay della card */}
                    <div className="card-overlay-top">
                      <button className={`card-icon-btn ${img.like ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); handleToggleLike(img.id_image);}} aria-label="like">♥</button>
                      <button className={`card-icon-btn ${isInCart ? 'card-icon-btn-remove' : ''}`} onClick={(e) => { e.stopPropagation(); handleToggleCart();}} aria-label="add to cart" disabled={img.sold}>{isInCart ? '−' : '＋'}</button>
                    </div>
                    <div className="card-overlay-bottom">
                      <span className="card-username">{img.user || 'Utente Sconosciuto'}</span>
                      <span className="card-price">{typeof img.price === 'string' || typeof img.price === 'number' ? `${parseFloat(img.price).toFixed(2)} €` : 'N/D'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Masonry>

      {/* Usa il nuovo componente ImageModal */}
      {imageToView && (
        <ImageModal
          imageUrl={imageToView.uri}
          imageDetails={{ // Passa i dettagli che vuoi mostrare nel modal
            user: imageToView.user,
            likes: imageToView.likes_count, // Assumendo che hai un campo likes_count
            isLiked: imageToView.like,     // Assumendo che hai un campo like (boolean)
            description: imageToView.description,
            // Aggiungi qui altri dettagli se necessario
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default PhotoGrid;