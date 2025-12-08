import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Banner = () => {
  const imgLinks = [
    "https://i.ibb.co.com/xSDq5NZY/1.jpg",
    "https://i.ibb.co.com/7J4gwnGv/2.jpg",
    "https://i.ibb.co.com/1Gdhs5H8/3.png",
  ];

  return (
    <div className="select-none">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        emulateTouch
        showArrows={false}
        swipeable
      >
        {imgLinks.map((img, index) => (
          <div key={index} onMouseDown={(e) => e.preventDefault()}>
            <img
              className="h-[650px] w-full object-cover select-none"
              src={img}
              alt={`Banner ${index + 1}`}
              draggable={false}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
