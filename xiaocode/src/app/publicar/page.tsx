"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicarEvento() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState("");
  const [packages, setPackages] = useState([{ type: "", price: 0, available: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddPackage = () => {
    setPackages([...packages, { type: "", price: 0, available: 0 }]);
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = field === "price" || field === "available" ? parseInt(value) : value;
    setPackages(updatedPackages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newEvent = {
      title,
      location,
      date,
      time,
      image: image || "https://placehold.co/600x400",
      packages,
    };

    try {
      const response = await fetch("/api/eventos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        toast.success("¡Evento publicado exitosamente!"); // Toast de éxito
        setTimeout(() => {
          router.push("/eventos");
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al publicar el evento"); // Toast de error
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor"); // Toast de error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <ToastContainer /> {/* Contenedor de toasts */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Publicar Nuevo Evento</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-black">
              Título del Evento
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black placeholder:text-gray-700"
              placeholder="Ingresa el título del evento"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-black">
              Ubicación
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black placeholder:text-gray-700"
              placeholder="Ingresa la ubicación"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-black">
              Fecha
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-medium text-black">
              Hora
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-black">
              URL de la Imagen
            </label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black placeholder:text-gray-700"
              placeholder="Ingresa la URL de la imagen"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-black">Paquetes</h3>
            {packages.map((pkg, index) => (
              <div key={index} className="flex space-x-4 mt-2">
                <input
                  type="text"
                  placeholder="Tipo"
                  value={pkg.type}
                  onChange={(e) => handlePackageChange(index, "type", e.target.value)}
                  className="block w-1/3 px-4 py-2 border border-gray-300 rounded-lg text-black placeholder:text-gray-700"
                  required
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={pkg.price}
                  onChange={(e) => handlePackageChange(index, "price", e.target.value)}
                  className="block w-1/3 px-4 py-2 border border-gray-300 rounded-lg text-black placeholder:text-gray-700"
                  required
                />
                <input
                  type="number"
                  placeholder="Disponibles"
                  value={pkg.available}
                  onChange={(e) => handlePackageChange(index, "available", e.target.value)}
                  className="block w-1/3 px-4 py-2 border border-gray-300 rounded-lg text-black placeholder:text-gray-700"
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
      <Footer />
    </div>
  );
}