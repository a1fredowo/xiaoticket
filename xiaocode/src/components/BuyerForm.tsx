"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface BuyerFormData {
  firstName: string;
  lastName: string;
  email: string;
  idNumber: string;
  billingAddress: string;
}

export default function BuyerForm({ onSubmit }: { onSubmit: (data: BuyerFormData) => void }) {
  const [formData, setFormData] = useState<BuyerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    idNumber: "",
    billingAddress: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    idNumber: "",
    billingAddress: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("user");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const validate = () => {
    const newErrors = {
      firstName: formData.firstName ? "" : "El nombre es obligatorio.",
      lastName: formData.lastName ? "" : "El apellido es obligatorio.",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ? ""
        : "El correo electrónico no es válido.",
      idNumber: /^[0-9]+-[0-9kK]$/.test(formData.idNumber)
        ? ""
        : "El RUT debe ser válido (sin puntos y con guión).",
      billingAddress: formData.billingAddress
        ? ""
        : "La dirección de facturación es obligatoria.",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "idNumber") {
      const formattedValue = value.replace(/[^0-9kK-]/g, "");
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        setIsSubmitting(true);
        await onSubmit(formData);
        toast.success("Datos enviados correctamente.");
      } catch (error) {
        toast.error("Ocurrió un error al enviar los datos. Intenta nuevamente.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Por favor, corrige los errores antes de continuar.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-black">Información del Comprador</h2>

      {/* Nombre */}
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-sm font-medium text-black">
          Nombre
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          placeholder="Ingresa tu nombre"
        />
        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
      </div>

      {/* Apellido */}
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-sm font-medium text-black">
          Apellido
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          placeholder="Ingresa tu apellido"
        />
        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
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
          disabled={!!localStorage.getItem("user")}
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

      {/* Dirección de Facturación */}
      <div className="mb-4">
        <label htmlFor="billingAddress" className="block text-sm font-medium text-black">
          Dirección de Facturación
        </label>
        <input
          type="text"
          id="billingAddress"
          name="billingAddress"
          value={formData.billingAddress}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          placeholder="Ingresa tu dirección de facturación"
        />
        {errors.billingAddress && (
          <p className="text-red-500 text-sm mt-1">{errors.billingAddress}</p>
        )}
      </div>

      {/* Botón de Continuar */}
      <button
        type="submit"
        disabled={
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.idNumber ||
          !formData.billingAddress ||
          Object.values(errors).some((error) => error) ||
          isSubmitting
        }
        className={`w-full py-2 px-4 rounded-lg transition ${
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.idNumber ||
          !formData.billingAddress ||
          Object.values(errors).some((error) => error) ||
          isSubmitting
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {isSubmitting ? "Enviando..." : "Continuar"}
      </button>
    </form>
  );
}