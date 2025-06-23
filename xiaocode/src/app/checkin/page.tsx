"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AFORO_MAXIMO = 100; // Puedes hacerlo dinámico si lo necesitas

export default function CheckinPage() {
  const [rut, setRut] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [aforo, setAforo] = useState(0);
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState<{ id: string; title: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");

  // Carga los eventos al iniciar
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Error al cargar eventos:", data);
        }
      })
      .catch((error) => {
        console.error("Error al cargar eventos:", error);
        setMensaje("Error al cargar eventos");
      });
  }, []);

  // Consulta el aforo en tiempo real
  const fetchAforo = async (id = eventId) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/checkin?eventId=${id}`);
      const data = await res.json();
      if (res.ok) {
        setAforo(data.count);
      } else {
        console.error("Error al obtener aforo:", data);
      }
    } catch (error) {
      console.error("Error al obtener aforo:", error);
    }
  };

  useEffect(() => {
    if (!eventId) return;
    fetchAforo(eventId);
    const interval = setInterval(() => fetchAforo(eventId), 5000);
    return () => clearInterval(interval);
  }, [eventId]);

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setEventId(selectedId);
    
    // Encuentra el título del evento seleccionado
    const selectedEvent = events.find(ev => ev.id === selectedId);
    setSelectedEventTitle(selectedEvent?.title || "");
  };

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    if (!eventId) {
      setMensaje("Selecciona un evento");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, rut }),
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ Check-in exitoso");
        setRut("");
        fetchAforo(eventId);
      } else {
        setMensaje(`❌ ${data.error || "Error en el check-in"}`);
      }
    } catch (error) {
      console.error("Error en check-in:", error);
      setMensaje("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const porcentaje = (aforo / AFORO_MAXIMO) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Check-In Manual</h1>
        
        {/* Mostrar título del evento seleccionado */}
        {selectedEventTitle && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800">
              Evento: {selectedEventTitle}
            </h2>
          </div>
        )}

        <form onSubmit={handleCheckin} className="mb-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <select
              value={eventId}
              onChange={handleEventChange}
              className="border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
              required
            >
              <option value="" className="text-gray-500">Selecciona un evento</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id} className="text-gray-900">
                  {ev.title || ev.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value.replace(/[^0-9kK-]/g, ""))}
              placeholder="Ingresa RUT (ej: 12345678-9)"
              className="border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[250px]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Procesando..." : "Check-In"}
            </button>
          </div>
        </form>
        {mensaje && (
          <p className={`mb-4 ${mensaje.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {mensaje}
          </p>
        )}
        {eventId && (
          <>
            <div className="mb-2">
              <strong>Aforo actual:</strong> {aforo} / {AFORO_MAXIMO}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className={`h-4 rounded-full ${
                  porcentaje > 90
                    ? "bg-red-500"
                    : porcentaje > 70
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${porcentaje}%` }}
              ></div>
            </div>
            {porcentaje > 90 && (
              <div className="text-red-600 font-bold">
                🚨 ¡Alerta! El aforo está casi completo.
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}