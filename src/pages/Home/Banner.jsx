import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router";

const Banner = () => {
  const imgLinks = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1449824913929-2b362a3fec17?q=80&w=2670&auto=format&fit=crop",
  ];

  return (
    <div className="relative h-[70vh] min-h-[600px] w-full bg-slate-900">
        
       {/* Carousel Background */}
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        showIndicators={false}
        interval={5000}
        stopOnHover={false}
        className="h-full w-full absolute inset-0 z-0"
      >
        {imgLinks.map((img, index) => (
          <div key={index} className="h-[70vh] min-h-[600px]">
            <img
              className="h-full w-full object-cover opacity-60"
              src={img}
              alt={`City Landscape ${index + 1}`}
            />
          </div>
        ))}
      </Carousel>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        <div className="max-w-3xl space-y-8 animate-in fade-in zoom-in-95 duration-700 slide-in-from-bottom-5">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-200 text-sm font-semibold tracking-wide border border-blue-500/30 backdrop-blur-sm">
                Empowering Communities
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
            Building a Better <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Future Together
            </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Identify infrastructure issues, report them instantly, and track the resolution. Join thousands of citizens making their city safer and cleaner.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link 
                    to="/report-issue"
                    className="btn btn-primary px-8 h-12 text-base font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                    Report an Issue
                </Link>
                <Link 
                    to="/how-it-works"
                    className="btn btn-ghost text-white border-white/20 hover:bg-white/10 px-8 h-12 text-base font-semibold w-full sm:w-auto"
                >
                    How It Works
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

