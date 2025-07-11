"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QRScanner from "@/components/QRScanner";

const AFORO_MAXIMO = 100;

export default function CheckinPage() {
  const [rut, setRut] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [aforo, setAforo] = useState(0);
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState<{ id: string; title: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [qrError, setQrError] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
        else console.error("Error al cargar eventos:", data);
      })
      .catch((error) => {
        console.error("Error al cargar eventos:", error);
        setMensaje("🌐 Error al cargar eventos - Verifica tu conexión");
      });
  }, []);

  // Función común para check-in
  const performCheckin = async (data: any) => {
    setMensaje("");
    setQrError("");
    setLoading(true);

    if (!eventId) {
      setMensaje("🚫 Selecciona un evento primero");
      setLoading(false);
      return;
    }

    try {
      // Obtener token del localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setMensaje("🔒 Debes iniciar sesión como administrador");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      const responseData = await res.json();

      if (res.ok && responseData.success) {
        setMensaje(responseData.message || "✅ Check-in exitoso");
        setRut("");
        setShowQRModal(false);
        fetchAforo(eventId);
      } else {
        const errorMsg = responseData.error || "Error en el check-in";
        if (data.isQRScan) {
          setQrError(errorMsg);
        } else {
          setMensaje(errorMsg);
        }
      }
    } catch (error) {
      const networkError = "🌐 Error de conexión - Verifica tu internet";
      if (data.isQRScan) {
        setQrError(networkError);
      } else {
        setMensaje(networkError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAforo = async (id = eventId) => {
    if (!id) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/checkin?eventId=${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) setAforo(data.count);
      else console.error("Error al obtener aforo:", data);
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
    const selectedEvent = events.find(ev => ev.id === selectedId);
    setSelectedEventTitle(selectedEvent?.title || "");
    setMensaje("");
    setQrError("");
  };

  // Check-in manual
  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    await performCheckin({ eventId, rut, isQRScan: false });
  };

  const porcentaje = (aforo / AFORO_MAXIMO) * 100;

  // Handler para QR (memoizado para evitar re-renders)
  const handleQRResult = useCallback(async (qrData: string) => {
    if (!isMountedRef.current) return;
    
    setQrError("");
    setMensaje("");
    setLoading(true);

    // 🧾 Validar formato QR
    let qrObj;
    try {
      qrObj = JSON.parse(qrData);
    } catch {
      setQrError("🧾 QR inválido o formato incorrecto");
      setLoading(false);
      return;
    }

    // Validar campos obligatorios
    if (!qrObj.eventId || !qrObj.rut) {
      setQrError("🧾 QR incompleto - Faltan datos obligatorios");
      setLoading(false);
      return;
    }

    // Realizar check-in
    await performCheckin({
      eventId: qrObj.eventId,
      rut: qrObj.rut,
      packageType: qrObj.packageType,
      buyerName: qrObj.buyerName,
      isQRScan: true
    });
  }, [eventId]);

  const openQRModal = () => {
    if (!eventId) {
      setMensaje("🚫 Selecciona un evento antes de usar la cámara");
      return;
    }
    setShowQRModal(true);
    setQrError("");
    setMensaje("");
  };

  const closeQRModal = useCallback(() => {
    setShowQRModal(false);
    setQrError("");
    // Dar tiempo a que el scanner se limpie antes de cerrar
    setTimeout(() => {
      setQrError("");
    }, 200);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-4 text-white">Check-In de Evento</h1>
        
        {/* Botones de modo */}
        <div className="mb-6 flex gap-4">
          <button
            className={`px-4 py-2 rounded transition ${
              !showQRModal 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setShowQRModal(false)}
          >
            📝 Check-In Manual
          </button>
          <button
            className={`px-4 py-2 rounded transition ${
              showQRModal 
                ? "bg-green-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={openQRModal}
          >
            📷 Check-In con Cámara
          </button>
        </div>

        {/* Selector de evento */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <label className="block text-white mb-2 font-semibold">Evento:</label>
          <select
            value={eventId}
            onChange={handleEventChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona un evento</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title || ev.name}
              </option>
            ))}
          </select>
          {selectedEventTitle && (
            <p className="text-blue-300 mt-2">📅 {selectedEventTitle}</p>
          )}
        </div>

        {/* Check-in manual */}
        {!showQRModal && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Check-In Manual</h2>
            <form onSubmit={handleCheckin}>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={rut}
                  onChange={(e) => setRut(e.target.value.replace(/[^0-9kK-]/g, ""))}
                  placeholder="Ingresa RUT (ej: 12345678-9)"
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !eventId}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition"
                >
                  {loading ? "Verificando..." : "Check-In"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mensajes de estado */}
        {mensaje && (
          <div className={`p-4 rounded-lg mb-4 ${
            mensaje.includes("✅") 
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {mensaje}
          </div>
        )}

        {/* Información del aforo */}
        {eventId && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Aforo del Evento</h3>
            <div className="mb-2 text-gray-700">
              <strong>Personas ingresadas:</strong> {aforo} / {AFORO_MAXIMO}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  porcentaje > 90
                    ? "bg-red-500"
                    : porcentaje > 70
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(porcentaje, 100)}%` }}
              ></div>
            </div>
            {porcentaje > 90 && (
              <div className="text-red-600 font-bold flex items-center gap-2">
                🚨 ¡Alerta! El aforo está casi completo ({porcentaje.toFixed(1)}%)
              </div>
            )}
          </div>
        )}

        {/* Modal QR */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                onClick={closeQRModal}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-800">📷 Escaneo QR</h2>
              <QRScanner onResult={handleQRResult} isActive={showQRModal} />
              
              {/* Errores del QR */}
              {qrError && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                  {qrError}
                </div>
              )}
              
              {loading && (
                <div className="mt-4 p-3 bg-blue-100 text-blue-700 border border-blue-300 rounded">
                  🔄 Verificando ticket...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}