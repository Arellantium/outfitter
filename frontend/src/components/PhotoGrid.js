import React, { useEffect, useRef, useCallback } from 'react';
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

  const pageRef = useRef(1);
  const loaderRef = useRef(null);
  const hasMoreRef = useRef(true);

  const fetchImages = useCallback(async () => {
    try {
      dispatch(fetchImagesStart());

      // ⚠️ USO LOCALE STATICO PER SVILUPPO — COMMENTA QUESTO BLOCCO QUANDO PASSI A REST API
      const allImages = require('../mock/allImages.json'); // importa da file statico
      await new Promise((r) => setTimeout(r, 500));

      if (allImages.length === 0) {
        hasMoreRef.current = false;
      } else {
        dispatch(fetchImagesSuccess(allImages));
        pageRef.current += 1;
      }

      // ✅ ATTIVA QUESTO BLOCCO PER CHIAMATA REST API
      /*
      const res = await fetch(`https://api.tuosito.com/images?page=${pageRef.current}`);
      const pagedImages = await res.json();

      if (pagedImages.length === 0) {
        hasMoreRef.current = false;
      } else {
        dispatch(fetchImagesSuccess(pagedImages));
        pageRef.current += 1;
      }
      */

    } catch (error) {
      dispatch(fetchImagesError(error.message));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!loaderRef.current || !hasMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchImages();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchImages, loading]);

  const handleToggleLike = (id_image) => {
    dispatch(toggleLike(id_image));
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="photo-grid mt-3 pt-2">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((img) => {
          const isInCart = cartItems.some(item => item.id_image === img.id_image);

          const handleToggleCart = () => {
            if (isInCart) {
              dispatch(removeFromCart(img.id_image));
            } else {
              dispatch(addToCart(img));
            }
          };

          return (
            <div key={`img-${img.id_image}`} className="masonry-item">
              <div className={`image-wrapper position-relative ${img.sold ? 'sold' : ''}`}>
                {img.sold && <div className="sold-badge">VENDUTO</div>}

                <img src={img.uri} alt={`img-${img.id_image}`} className="img-fluid" />
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
                      disabled={img.sold}
                    >
                      {isInCart ? '−' : '＋'}
                    </button>
                  </div>
                  <div className="overlay-bottom">
                    <span className="username">{img.user}</span>
                    <span className="price">{img.price} €</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Masonry>
      {hasMoreRef.current && (
        <div ref={loaderRef} className="loading">
          Caricamento...
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
