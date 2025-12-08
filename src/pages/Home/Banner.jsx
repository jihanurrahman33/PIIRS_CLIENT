import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
const Banner = () => {
  const imgLinks = [
    "https://i.ibb.co.com/xSDq5NZY/1.jpg",
    "https://i.ibb.co.com/7J4gwnGv/2.jpg",
    "https://i.ibb.co.com/1Gdhs5H8/3.png",
  ];
  return (
    <div>
      <Carousel
        autoPlay
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
      >
        {imgLinks.map((img) => (
          <div>
            <img className="h-[650px] object-cover" src={img} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
