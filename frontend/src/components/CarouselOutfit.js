import React from 'react';
import { Carousel, CarouselItem, CarouselCaption } from 'react-bootstrap';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Outfit moderno donna',
    caption: 'Nuova collezione'
  },
  {
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    alt: 'Outfit streetwear',
    caption: 'Streetwear per tutti'
  },
  {
    src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Outfit donna elegante',
    caption: 'Eleganza senza tempo',
    link: 'localhost:3000/chatPage'
  }
];

const CarouselOutfit = () => {
  return (
    <div className="container py-4">
      <Carousel
        interval={3000}
        pause="hover"
        prevIcon={<FaArrowAltCircleLeft size={32} className="text-dark" />}
        nextIcon={<FaArrowAltCircleRight size={32} className="text-dark" />}
      >
        {images.map((img, index) => (
          <CarouselItem key={index}>
            <img
              className="d-block w-100"
              src={img.src}
              alt={img.alt}
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
            <CarouselCaption className="bg-dark bg-opacity-50 rounded p-2">
              <h5>{img.caption}</h5>
            </CarouselCaption>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselOutfit;
