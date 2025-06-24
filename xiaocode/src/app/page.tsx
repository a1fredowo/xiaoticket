"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import EventList from "@/components/EventList"; // Importar el componente EventList
import Footer from "@/components/Footer"; // Importar el Footer

export default function App() {
  const images = [
    "https://aegwebprod.blob.core.windows.net/content/content_images/665/Yj1HlDnqCjVk6crnNeKvERnsI7yzJ2jAkPC6IfZV.jpg",
    "https://static.ticketmaster.sg/images/activity/25sg_lsf_7212db8921d7bfd13149a340a8171f4a.png",
    "https://themusicuniverse.com/wp-content/uploads/2025/06/txt4worldtour.jpg",
    "https://cnakpop.com/cdn/shop/articles/SEOon_TWICE_TOUR.jpg?v=1749440693",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambiar automáticamente la imagen cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Banner */}
      <div className="relative w-full h-[450px] overflow-hidden">
        {/* Contenedor de imágenes */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Banner ${index + 1}`}
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Flecha izquierda */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition"
        >
          &#8592;
        </button>

        {/* Flecha derecha */}
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition"
        >
          &#8594;
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="flex-grow">
        <EventList />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}