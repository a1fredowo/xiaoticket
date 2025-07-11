"use client";
import React, { useState, useRef } from "react";
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [packages, setPackages] = useState([{ type: "", price: 0, available: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPackage = () => {
    setPackages([...packages, { type: "", price: 0, available: 0 }]);
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = field === "price" || field === "available" ? parseInt(value) : value;
    setPackages(updatedPackages);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
      setImagePreview(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);
    if (image) formData.append("image", image);
    formData.append("packages", JSON.stringify(packages));

    try {
      const response = await fetch("/api/eventos", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("¡Evento publicado exitosamente!");
        setTimeout(() => {
          router.push("/eventos");
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al publicar el evento");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Publicar Nuevo Evento</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-blue-100 via-white to-gray-100 p-8 rounded-xl shadow-xl max-w-lg mx-auto"
          encType="multipart/form-data"
        >
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-black mb-1">Título del Evento</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-black" required />
          </div>
          <div className="mb-6">
            <label htmlFor="location" className="block text-sm font-medium text-black mb-1">Ubicación</label>
            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-black" required />
          </div>
          <div className="mb-6 flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="date" className="block text-sm font-medium text-black mb-1">Fecha</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-black" required />
            </div>
            <div className="w-1/2">
              <label htmlFor="time" className="block text-sm font-medium text-black mb-1">Hora</label>
              <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-black" required />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-1">Imagen del Evento</label>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer bg-gray-50 hover:bg-gray-100"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleImageClick}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-48 h-32 object-cover mb-2 rounded" />
              ) : (
                <span className="text-gray-500">Arrastra una imagen aquí o haz click para seleccionar</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-black mb-2">Paquetes</h3>
            {packages.map((pkg, index) => (
              <div key={index} className="flex space-x-4 mt-2 items-center">
                <input
                  type="text"
                  placeholder="Tipo"
                  value={pkg.type}
                  onChange={e => handlePackageChange(index, "type", e.target.value)}
                  className="block w-1/3 px-4 py-2 border border-blue-200 rounded-lg text-black focus:border-blue-400"
                  required
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={pkg.price === 0 ? "" : pkg.price}
                  min={0}
                  onChange={e => handlePackageChange(index, "price", e.target.value)}
                  className="block w-1/3 px-4 py-2 border border-blue-200 rounded-lg text-black focus:border-blue-400"
                  required
                />
                <input
                  type="number"
                  placeholder="Disponibles"
                  value={pkg.available === 0 ? "" : pkg.available}
                  min={0}
                  onChange={e => handlePackageChange(index, "available", e.target.value)}
                  className="block w-1/3 px-4 py-2 border border-blue-200 rounded-lg text-black focus:border-blue-400"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPackage}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition"
            >
              Agregar Paquete
            </button>
            {/* Vista previa de paquetes */}
            <div className="mt-4">
              <h4 className="font-semibold text-blue-700 mb-2">Vista previa:</h4>
              <ul className="space-y-1">
                {packages
                  .filter(pkg => pkg.type || pkg.price || pkg.available)
                  .map((pkg, idx) => (
                    <li
                      key={idx}
                      className="bg-white rounded-md px-3 py-2 shadow border border-blue-100 text-gray-800"
                    >
                      <span className="font-bold">{pkg.type || "Sin tipo"}</span> — ${pkg.price || "?"} — {pkg.available || "?"} disponibles
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <button type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
            disabled={isLoading}>
            {isLoading ? "Publicando..." : "Publicar Evento"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}