"use client";
import React from "react";
import { useParams } from "next/navigation";
import events from "@/data/events.json"; // Importar los datos de eventos
import Header from "@/components/Header";

export default function EventPage() {
  const { id } = useParams(); // Obtener el ID del evento desde la URL
  const event = typeof id === "string" ? events.find((event) => event.id === parseInt(id)) : null; // Buscar el evento por ID
  if (!event) {
    return (
      <div>
        <Header />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Evento no encontrado</h1>
          <p>El evento que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white text-black rounded-lg shadow-md overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <p className="text-sm text-gray-500">{event.location}</p>
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <p className="text-lg text-gray-700">
              Fecha: {event.date} - Hora: {event.time}
            </p>
            <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Comprar Entradas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}