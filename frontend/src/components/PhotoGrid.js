import React, { useState, useEffect, useCallback, useRef } from 'react';
import Masonry from 'react-masonry-css';
import './PhotoGrid.css';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlusCircle } from 'react-icons/fa';
import CreatePost from './CreatePost';
import ImageModal from './ImageModal';
import {
  fetchImagesStart,
  fetchImagesSuccess,
  fetchImagesError,
  toggleLike
} from '../redux/reducers/imagesSliceReducer';
import { addToCart, removeFromCart } from '../redux/reducers/cartReducer';

const themeColors = {
  secondary: '#f0e9e0'
};

const PhotoGrid = () => {
  const dispatch = useDispatch();

  const [imageToView, setImageToView] = useState(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.loading);
  const error = useSelector((state) => state.images.error);
  const cartItems = useSelector((state) => state.cart.items);
  //const imagesAlreadyLoaded = images && images.length > 0;

  /* PAGINAZIONE */
  const pageRef = useRef(1);
  const loaderRef = useRef(null);
  const hashMoreRef = useRef(true);


  const fetchImages = useCallback(async () => {
    //if (imagesAlreadyLoaded) return;

    try {
      dispatch(fetchImagesStart());
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:8006/outfit-posts?page=${pageRef.current}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error(`Errore: ${res.status}`);
      const data = await res.json();

      if (data.length === 0) {
        hashMoreRef.current = false;
      } else {
        dispatch(fetchImagesSuccess(data));
        pageRef.current += 1;
      }
      
    } catch (err) {
      dispatch(fetchImagesError(err.message));
    }
  }, [dispatch]);

  /*useEffect(() => {
    if (!imagesAlreadyLoaded) {
      fetchImages();
    }
  }, [fetchImages, imagesAlreadyLoaded]);*/

  useEffect(() => {
    if (!loaderRef.current || !hashMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
      if (entries[0].isIntersecting && !loading) {
        fetchImages();
      }
    },
    {threshold: 1});

    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchImages, loading]);

  const handleToggleLike = (id_image) => {
    dispatch(toggleLike(id_image));
  };

  const openModalWithImage = (imageObject) => {
    setImageToView(imageObject);
  };

  const closeModal = () => {
    setImageToView(null);
  };

  const handleOpenCreatePostModal = () => {
    setShowCreatePostModal(true);
  };

  const handleCloseCreatePostModal = () => {
    setShowCreatePostModal(false);
  };

  const breakpointColumnsObj = { default: 3, 1100: 3, 992: 2, 700: 2, 576: 1 };

  //if (loading && !imagesAlreadyLoaded) return <div className="loading text-center mt-5 py-5">Caricamento immagini...</div>;
  if (error) return <div className="text-danger text-center mt-5 py-5">Errore nel caricamento: {error}</div>;
  if (!images && !loading && !error) return <div className="text-center mt-5 py-5">Nessuna immagine da visualizzare.</div>;

  return (
    <div className="photo-grid-wrapper container-fluid-equivalent px-2 px-sm-3 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="latest-looks-title" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#333' }}>Latest Looks</h2>
        <button
          className="btn-custom-upload"
          onClick={handleOpenCreatePostModal}
          style={{
            backgroundColor: '#d9a86c',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.9rem',
            fontWeight: 500,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
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
            if (isInCart) dispatch(removeFromCart(img.id_image));
            else dispatch(addToCart(img));
          };

          return (
            <div key={`card-${img.id_image}`} className="masonry-item">
              <div
                className={`card-image-clickable-area ${img.sold ? 'sold' : ''}`}
                onClick={() => { if (!img.sold) openModalWithImage(img); }}
                style={{ cursor: img.sold ? 'default' : 'pointer' }}
              >
                {img.sold && <div className="sold-badge">VENDUTO</div>}
                <img
                  src={img.uri}
                  alt={img.description || `Immagine ${img.id_image}`}
                  className="card-img-top-masonry"
                />
                
                  <div className="card-image-overlay">
                    <div className="card-overlay-top">
                      <button className={`card-icon-btn ${img.like ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); handleToggleLike(img.id_image); }} aria-label="like">♥</button>
                      {!img.sold && (
                      <button className={`card-icon-btn ${isInCart ? 'card-icon-btn-remove' : ''}`} onClick={(e) => { e.stopPropagation(); handleToggleCart(); }} aria-label="add to cart" disabled={img.sold}>{isInCart ? '−' : '＋'}</button>
                      )}
                    </div>
                    <div className="card-overlay-bottom">
                      <span className="card-username">{img.user || 'Utente Sconosciuto'}</span>
                      <span className="card-price">{typeof img.price === 'string' || typeof img.price === 'number' ? `${parseFloat(img.price).toFixed(2)} €` : 'N/D'}</span>
                    </div>
                  </div>
                
              </div>
            </div>
          );
        })}
      </Masonry>

      {hashMoreRef.current && (
        <div ref={loaderRef} className="loading">Caricamento...</div>
      )}  

      {imageToView && (
        <ImageModal
          imageId={imageToView.id_image}
          onClose={closeModal}
        />
      )}

      {showCreatePostModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050,
            padding: '20px'
          }}
          onClick={handleCloseCreatePostModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="custom-modal-content-scroll"
            style={{
              backgroundColor: 'transparent',
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <CreatePost isModal={true} onCloseModal={handleCloseCreatePostModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;