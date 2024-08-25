import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface EventCarouselProps {
  children: React.ReactNode;
}

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        zIndex: 1,
        right: "4%", // Position over the side events
        transform: "translateY(-50%)", // Center vertically
      }}
      onClick={onClick}
    >
      <FaArrowRight />
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        zIndex: 1,
        left: "4%", // Position over the side events
        transform: "translateY(-50%)", // Center vertically
      }}
      onClick={onClick}
    >
      <FaArrowLeft />
    </div>
  );
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
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          arrows: false,
          draggable: true,
        },
      },
    ],
  };

  return (
    <div className="carousel-container sm:w-1/2 sm:mx-auto relative my-12">
      <Slider {...settings}>
        {children}
      </Slider>
    </div>
  );
}
