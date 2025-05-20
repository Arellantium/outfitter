// src/PhotoGrid.js
import React, { useEffect, useCallback } from 'react'; // Rimosso useState e useRef non più strettamente necessari per questa logica
import Masonry from 'react-masonry-css';
import './PhotoGrid.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchImagesStart,
  fetchImagesSuccess,
  fetchImagesError,
  toggleLike
} from '../redux/reducers/imagesSliceReducer';
import { addToCart, removeFromCart } from '../redux/reducers/cartReducer';

const PhotoGrid = () => {
  const dispatch = useDispatch();

  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.loading);
  const error = useSelector((state) => state.images.error);
  const cartItems = useSelector((state) => state.cart.items);

  // Controlla se le immagini sono già state caricate nello stato Redux
  const imagesAlreadyLoaded = images && images.length > 0;

  const fetchImages = useCallback(async () => {
    // Carica solo se le immagini non sono già nello stato Redux
    if (imagesAlreadyLoaded) {
        console.log('[PhotoGrid] fetchImages - Le immagini sono già presenti nello stato Redux, non ricarico.');
        return;
    }

    try {
      dispatch(fetchImagesStart());
      console.log('[PhotoGrid] fetchImages - Avvio caricamento da allImages.json (perché lo stato è vuoto)');

      const allImagesData = require('../mock/allImages.json');
      console.log(`[PhotoGrid] fetchImages - Dati caricati da allImages.json, numero di immagini: ${allImagesData.length}`);
      await new Promise((r) => setTimeout(r, 500)); 

      if (allImagesData.length === 0) {
        console.log('[PhotoGrid] fetchImages - allImages.json è vuoto.');
      } else {
        dispatch(fetchImagesSuccess(allImagesData)); 
        console.log('[PhotoGrid] fetchImages - Dati inviati a fetchImagesSuccess.');
      }

    } catch (err) {
      console.error('[PhotoGrid] fetchImages - Errore durante il caricamento:', err);
      dispatch(fetchImagesError(err.message));
    }
  }, [dispatch, imagesAlreadyLoaded]); // Dipende da imagesAlreadyLoaded

  // useEffect per il caricamento iniziale delle immagini
  useEffect(() => {
    console.log('[PhotoGrid] useEffect [fetchImages] - Eseguito. imagesAlreadyLoaded:', imagesAlreadyLoaded);
    // Chiama fetchImages solo se non sono state caricate (cioè, la prima volta che il componente monta e images è vuoto)
    if (!imagesAlreadyLoaded) {
        fetchImages();
    }
  }, [fetchImages, imagesAlreadyLoaded]);


  const handleToggleLike = (id_image) => {
    dispatch(toggleLike(id_image));
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  // Modifica la condizione di loading: mostra loading solo se non ci sono immagini e stiamo caricando
  if (loading && !imagesAlreadyLoaded) return <div className="loading text-center mt-5">Caricamento immagini...</div>;
  if (error) return <div className="text-danger text-center mt-5">Errore nel caricamento: {error}</div>;
  // Mostra "Nessuna immagine" solo se il caricamento è finito (non loading) e non ci sono immagini
  if (!loading && !imagesAlreadyLoaded && !error) return <div className="text-center mt-5">Nessuna immagine da visualizzare.</div>;


  return (
    <div className="photo-grid mt-3 pt-2">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((img) => {
          if (!img || typeof img.id_image === 'undefined') {
            console.warn('[PhotoGrid] Render Map - Trovata immagine non valida o senza id_image:', img);
            return null; 
          }

          const isInCart = cartItems.some(item => String(item.id_image) === String(img.id_image));

          const handleToggleCart = () => {
            if (isInCart) {
              dispatch(removeFromCart(img.id_image));
            } else {
              console.log('[PhotoGrid] Aggiunta al carrello:', JSON.stringify(img, null, 2));
              dispatch(addToCart(img));
            }
          };

          return (
            <div key={`img-${img.id_image}`} className="masonry-item">
              <div className={`image-wrapper position-relative ${img.sold ? 'sold' : ''}`}>
                {img.sold && <div className="sold-badge">VENDUTO</div>}

                <img src={img.uri} alt={img.description || `Immagine ${img.id_image}`} className="img-fluid" />
                <div className="image-overlay">
                  <div className="overlay-top">
                    <button
                      className={`icon-btn ${img.like ? 'liked' : ''}`}
                      onClick={() => handleToggleLike(img.id_image)}
                      aria-label="like"
                    >
                      ♥
                    </button>

                    <button
                      className={`icon-btn ${isInCart ? 'icon-btn-remove' : ''}`}
                      onClick={handleToggleCart}
                      aria-label="add to cart"
                      disabled={img.sold} // La disabilitazione dipende da img.sold
                    >
                      {isInCart ? '−' : '＋'}
                    </button>
                  </div>
                  <div className="overlay-bottom">
                    <span className="username">{img.user || 'Utente Sconosciuto'}</span>
                    <span className="price">{typeof img.price === 'string' || typeof img.price === 'number' ? `${parseFloat(img.price).toFixed(2)} €` : 'N/D'}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Masonry>
      {/* Non c'è più bisogno del loaderRef per il file statico */}
    </div>
  );
};

export default PhotoGrid;