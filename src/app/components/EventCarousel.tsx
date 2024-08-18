import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface EventCarouselProps {
  children: React.ReactNode;
  onEventClick: () => void;
}

export default function EventCarousel({ children }: EventCarouselProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    centerMode: true,
    centerPadding: "15%",
    draggable: false, 
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          arrows: false,
        },
      },
    ],
  };



  return (
    <div className="carousel-container sm:w-1/2 sm:mx-auto">
      <Slider {...settings}>
      {children}
      </Slider>
    </div>
  );
}
