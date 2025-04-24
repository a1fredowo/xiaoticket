"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import events from "@/data/events.json"; // Importar los datos de eventos
import Header from "@/components/Header";

export default function EventPage() {
  const { id } = useParams(); // Obtener el ID del evento desde la URL
  const event = typeof id === "string" ? events.find((event) => event.id === parseInt(id)) : null; // Buscar el evento por ID
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Estado para mostrar el modal de pago
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // Método de pago seleccionado
  const [selectedPackage, setSelectedPackage] = useState(null); // Paquete seleccionado para el pago

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

  const handlePurchase = (pkg) => {
    setSelectedPackage(pkg); // Establecer el paquete seleccionado
    setShowPaymentModal(true); // Mostrar el modal de pago
  };

  const handlePayment = () => {
    alert(`Pago realizado con ${selectedPaymentMethod} para el paquete ${selectedPackage?.type}`);
    setShowPaymentModal(false); // Cerrar el modal después del pago
  };

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
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-2">Paquetes disponibles:</h2>
              <ul className="space-y-4">
                {event.packages.map((pkg) => (
                  <li key={pkg.type} className="flex justify-between items-center border p-4 rounded-lg">
                    <div>
                      <p className="font-medium">{pkg.type}</p>
                      <p className="text-gray-600">${pkg.price} CLP</p>
                    </div>
                    <button
                      onClick={() => handlePurchase(pkg)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Comprar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Selecciona un método de pago</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Métodos de Pago:
              </label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Selecciona un método</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="PayPal">PayPal</option>
                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}