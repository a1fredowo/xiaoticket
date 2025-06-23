"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ComprarReventaPage() {
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyQuantity, setBuyQuantity] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetch("/api/reventa")
      .then((res) => res.json())
      .then((data) => setPublicaciones(data.publicaciones || []))
      .catch((error) => {
        console.error("Error fetching publicaciones:", error);
        setPublicaciones([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBuy = async (pub: any) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión");
    
    const quantity = buyQuantity[pub._id] || 1;
    
    try {
      const res = await fetch("/api/reventa/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reventaId: pub._id,
          quantity,
        }),
      });
      
      if (res.ok) {
        alert("¡Compra realizada!");
        setPublicaciones((prev) =>
          prev.map((p) =>
            p._id === pub._id ? { ...p, quantity: p.quantity - quantity } : p
          )
        );
      } else {
        const data = await res.json();
        alert(data.error || "Error al comprar");
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Error de conexión. Intenta nuevamente.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-center mb-8">Comprar Tickets de Reventa</h1>
        <p className="text-center mb-6 text-gray-100">
          Aquí puedes ver los tickets publicados por otros usuarios y comprarlos de forma segura.
        </p>
        {loading ? (
          <p className="text-center text-gray-500">Cargando publicaciones...</p>
        ) : publicaciones.length === 0 ? (
          <p className="text-center text-gray-500">No hay tickets en reventa actualmente.</p>
        ) : (
          <ul>
            {publicaciones.map((pub, idx) => (
              <li key={pub._id || idx} className="mb-4 p-4 border rounded-lg bg-white text-black">
                <p><strong>Evento:</strong> {pub.eventName}</p>
                <p><strong>Fecha:</strong> {pub.eventDate} - <strong>Hora:</strong> {pub.eventTime}</p>
                <p><strong>Lugar:</strong> {pub.eventLocation}</p>
                <p><strong>Paquete:</strong> {pub.packageType}</p>
                <p><strong>Vendedor:</strong> {pub.sellerName}</p>
                <p><strong>Precio:</strong> ${pub.price} CLP</p>
                <p><strong>Cantidad disponible:</strong> {pub.quantity}</p>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="1"
                    max={pub.quantity}
                    value={buyQuantity[pub._id] || 1}
                    onChange={(e) =>
                      setBuyQuantity({
                        ...buyQuantity,
                        [pub._id]: parseInt(e.target.value) || 1,
                      })
                    }
                    className="border rounded px-2 py-1 w-16"
                  />
                  <button
                    onClick={() => handleBuy(pub)}
                    disabled={pub.quantity === 0}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded"
                  >
                    Comprar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}