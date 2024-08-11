import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface EventCarouselProps {
  children: React.ReactNode;
}

export default function EventCarousel({ children }: EventCarouselProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 10000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 100,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 640, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="carousel-container" >
      <Slider {...settings}>
        {children}
      </Slider>
    </div>
  );
}
