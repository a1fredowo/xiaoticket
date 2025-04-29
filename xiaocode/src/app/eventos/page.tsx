"use client";
import React from "react";
import Header from "@/components/Header";
import EventList from "@/components/EventList"; // Importar el componente EventList
import Footer from "@/components/Footer"; // Importar el Footer

export default function EventosPage() {
  return (
    <div>
      <Header />
      <h1 className="text-2xl font-bold text-center my-8">Eventos Próximos</h1>
      <EventList /> {/* Eliminar la prop events */}
      <Footer />
    </div>
  );
}