"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";

export default function Page() {
  const images = [
    "https://placehold.co/1920x450",
    "https://impact.economist.com/perspectives/sites/default/files/visa-hero-image-1920x450.jpg",
    "https://bishopsmove.com/wp-content/uploads/2025/01/keizersgrachtreguliersgrachtamsterdam.jpg",
  ];

  const events = [ // Idealmente esto iría en una base de datos o en un archivo JSON
    {
      id: 1,
      image: "https://placehold.co/600x400",
      title: "Concierto de Rock",
      location: "Teatro Caupolicán - Santiago Centro",
      date: "15 de Abril, 2025",
      time: "8:00 PM",
    },
    {
      id: 2,
      image: "https://placehold.co/600x400",
      title: "Feria de Tecnología",
      location: "Espacio Riesco - Huechuraba",
      date: "20 de Abril, 2025",
      time: "10:00 AM",
    },
    {
      id: 3,
      image: "https://placehold.co/600x400",
      title: "Festival de Cine",
      location: "Cinepolis La Reina - La Reina",
      date: "25 de Abril, 2025",
      time: "6:00 PM",
    },
    {
      id: 4,
      image: "https://placehold.co/600x400",
      title: "Exposición de Arte",
      location: "Parque Bustamante - Providencia",
      date: "30 de Abril, 2025",
      time: "4:00 PM",
    },
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
    <div>
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">{event.location}</p>
                <h3 className="text-lg text-black font-bold">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {event.date} - {event.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}