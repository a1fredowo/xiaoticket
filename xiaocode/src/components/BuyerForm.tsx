"use client";
import React, { useState, useEffect } from "react";

interface BuyerFormData {
  name: string;
  email: string;
  idNumber: string;
}

export default function BuyerForm({ onSubmit }: { onSubmit: (data: BuyerFormData) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    idNumber: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    idNumber: "",
  });

  useEffect(() => {
    // Autocompletar el correo si el usuario ha iniciado sesión
    const savedEmail = localStorage.getItem("user");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const validate = () => {
    const newErrors = {
      name: formData.name ? "" : "El nombre completo es obligatorio.",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ? ""
        : "El correo electrónico no es válido.",
      idNumber: /^[0-9]+-[0-9kK]$/.test(formData.idNumber)
        ? ""
        : "El RUT debe ser válido (sin puntos y con guión).",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Formatear el RUT automáticamente
    if (name === "idNumber") {
      const formattedValue = value.replace(/[^0-9kK-]/g, ""); // Permitir solo números, 'k', 'K' y guión
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData); // Enviar los datos al flujo de compra
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-black">Información del Comprador</h2>

      {/* Nombre Completo */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-black">
          Nombre Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          placeholder="Ingresa tu nombre completo"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Correo Electrónico */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-black">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          placeholder="Ingresa tu correo electrónico"
          disabled={!!localStorage.getItem("user")} // Deshabilitar si el correo está autocompletado
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Número de RUT */}
      <div className="mb-4">
        <label htmlFor="idNumber" className="block text-sm font-medium text-black">
          Número de RUT
        </label>
        <input
          type="text"
          id="idNumber"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          placeholder="Ejemplo: 12345678-9"
        />
        {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
      </div>

      {/* Botón de Continuar */}
      <button
        type="submit"
        disabled={!formData.name || !formData.email || !formData.idNumber || Object.values(errors).some((error) => error)}
        className={`w-full py-2 px-4 rounded-lg transition ${
          !formData.name || !formData.email || !formData.idNumber || Object.values(errors).some((error) => error)
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        Continuar
      </button>
    </form>
  );
}