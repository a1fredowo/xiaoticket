"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import events from "@/data/events.json"; // Importar los eventos existentes
import Header from "@/components/Header";

export default function PublicarEvento() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState("");
  const [packages, setPackages] = useState([{ type: "", price: 0, available: 0 }]);
  const router = useRouter();

  const handleAddPackage = () => {
    setPackages([...packages, { type: "", price: 0, available: 0 }]);
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = field === "price" || field === "available" ? parseInt(value) : value;
    setPackages(updatedPackages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear un nuevo evento
    const newEvent = {
      id: events.length + 1, // Generar un ID único
      image: image || "https://placehold.co/600x400", // Imagen por defecto si no se proporciona
      title,
      location,
      date,
      time,
      packages,
    };

    // Simular agregar el evento al JSON (solo en memoria)
    events.push(newEvent);
    alert("Evento publicado exitosamente!");

    // Redirigir a la lista de eventos
    router.push("/eventos");
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-6">Publicar Nuevo Evento</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título del Evento
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Ubicación
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Hora
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              URL de la Imagen
            </label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700">Paquetes</h3>
            {packages.map((pkg, index) => (
              <div key={index} className="flex space-x-4 mt-2">
                <input
                  type="text"
                  placeholder="Tipo"
                  value={pkg.type}
                  onChange={(e) => handlePackageChange(index, "type", e.target.value)}
                  className="block w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={pkg.price}
                  onChange={(e) => handlePackageChange(index, "price", e.target.value)}
                  className="block w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Disponibles"
                  value={pkg.available}
                  onChange={(e) => handlePackageChange(index, "available", e.target.value)}
                  className="block w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPackage}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Agregar Paquete
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Publicar Evento
          </button>
        </form>
      </div>
    </div>
  );
}