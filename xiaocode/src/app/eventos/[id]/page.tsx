"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EventPage() {
  const { id } = useParams(); // Obtener la ID del evento desde la URL
  const [event, setEvent] = useState(null); // Estado para almacenar el evento
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar el spinner de carga
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Estado para mostrar el modal de pago
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // Método de pago seleccionado
  const [selectedPackage, setSelectedPackage] = useState(null); // Paquete seleccionado para el pago
  const [selectedQuantity, setSelectedQuantity] = useState(0); // Cantidad de entradas seleccionadas

  // Obtener el evento desde la API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true); // Mostrar el spinner mientras se realiza la solicitud
        const response = await fetch(`/api/eventos/${id}`); // Llamar a la API con la ID
        if (response.ok) {
          const data = await response.json();
          setEvent(data); // Guardar el evento en el estado
        } else {
          console.error("Error al obtener el evento:", response.statusText);
        }
      } catch (error) {
        console.error("Error al conectar con la API:", error);
      } finally {
        setIsLoading(false); // Ocultar el spinner después de la solicitud
      }
    };

    fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <Header />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Evento no encontrado</h1>
          <p>El evento que buscas no existe o ha sido eliminado.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePurchase = (pkg) => {
    if (selectedQuantity > 0) {
      setSelectedPackage(pkg); // Establecer el paquete seleccionado
      setShowPaymentModal(true); // Mostrar el modal de pago
    } else {
      alert("Por favor, selecciona una cantidad de entradas.");
    }
  };

  const handlePayment = () => {
    alert(
      `Pago realizado con ${selectedPaymentMethod} para el paquete ${selectedPackage?.type} con ${selectedQuantity} entradas.`
    );
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
                      <p
                        className={`text-sm font-medium ${
                          pkg.available > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {pkg.available > 0 ? "En stock" : "Agotado"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                        className="border border-gray-300 rounded-lg px-2 py-1"
                        disabled={pkg.available === 0}
                      >
                        <option value="0">Cantidad: 0</option>
                        {Array.from(
                          { length: Math.min(pkg.available || 0, 5) }, // Asegura que `pkg.available` sea válido
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Cantidad: {i + 1}
                            </option>
                          )
                        )}
                      </select>
                      <button
                        onClick={() => handlePurchase(pkg)}
                        className={`px-4 py-2 rounded-lg transition ${
                          pkg.available > 0
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={pkg.available === 0}
                      >
                        Comprar
                      </button>
                    </div>
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
            <h2 className="text-xl font-bold mb-4 text-black">Selecciona un método de pago</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">
                Métodos de Pago:
              </label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
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
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
      <Footer />
    </div>
  );
}