import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './PhotoGrid.css';

const PhotoGrid = ({ fetchImages }) => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // Funzione per caricare nuove immagini
  const loadImages = useCallback(async () => {
    const newImages = await fetchImages(page);
    if (newImages.length === 0) {
      setHasMore(false);
    } else {
      setImages(prev => [...prev, ...newImages]);
      setPage(prev => prev + 1);
    }
  }, [page, fetchImages]);

  // Observer per il trigger dell'infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadImages();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, loadImages, hasMore]);

  return (
    <Container fluid className="photo-grid">
      <Row>
        {images.map((img, i) => (
          <Col key={i} xs={6} md={4} lg={4} className="mb-3">
            <div className="image-wrapper">
              <img src={img.url} alt={`img-${i}`} className="img-fluid" />
            </div>
          </Col>
        ))}
      </Row>
      {hasMore && <div ref={loaderRef} className="loading">Caricamento...</div>}
    </Container>
  );
};

export default PhotoGrid;
