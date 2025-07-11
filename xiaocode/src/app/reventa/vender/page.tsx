"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function VenderReventaPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showResellModal, setShowResellModal] = useState(false);
  const [resellPrice, setResellPrice] = useState("");
  const [resellQuantity, setResellQuantity] = useState(1);

  // Transferencia (puedes mantener la lógica anterior si la necesitas)
  const [transferId, setTransferId] = useState("");
  const [transferName, setTransferName] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch("/api/etickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTickets(data.tickets || []);
      setLoading(false);
    };
    fetchTickets();
  }, []);

  const openResellModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setResellPrice("");
    setResellQuantity(1);
    setShowResellModal(true);
  };

  const handleResell = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    await fetch(`/api/reventa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ticketId: selectedTicket._id || selectedTicket.id,
        price: resellPrice,
        quantity: resellQuantity,
      }),
    });
    alert("Ticket publicado en reventa.");
    setShowResellModal(false);
    setSelectedTicket(null);
  };

  // Transferencia (opcional, igual que antes)
  const openTransferModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setTransferId("");
    setTransferName("");
    setShowTransferModal(true);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/etickets`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "transfer",
        ticketId: selectedTicket?._id || selectedTicket?.id,
        newOwnerId: transferId,
        newOwnerName: transferName,
      }),
    });
    if (res.ok) {
      alert("Ticket transferido.");
      setShowTransferModal(false);
      setSelectedTicket(null);
      setTransferId("");
      setTransferName("");
    } else {
      const data = await res.json();
      alert(data.error || "Error al transferir");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Vender o Transferir Tickets</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : tickets.length === 0 ? (
          <p>No tienes tickets disponibles.</p>
        ) : (
          <ul>
            {tickets.map((ticket, idx) => (
              <li key={ticket._id || ticket.id || idx} className="mb-4 p-4 border rounded-lg bg-white text-black">
                <p><strong>Evento:</strong> {ticket.eventName}</p>
                <p><strong>Fecha:</strong> {ticket.eventDate} - <strong>Hora:</strong> {ticket.eventTime}</p>
                <p><strong>Lugar:</strong> {ticket.eventLocation}</p>
                <p><strong>Paquete:</strong> {ticket.packageType}</p>
                <p><strong>Cantidad:</strong> {ticket.quantity}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={() => openResellModal(ticket)}
                  >
                    Publicar en Reventa
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    onClick={() => openTransferModal(ticket)}
                  >
                    Transferir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Modal de publicación en reventa */}
        {showResellModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-black">Publicar Ticket en Reventa</h2>
              <form onSubmit={handleResell}>
                <div className="mb-4">
                  <label className="block text-black mb-1">Precio por entrada (CLP)</label>
                  <input
                    type="number"
                    min={1}
                    value={resellPrice}
                    onChange={(e) => setResellPrice(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-black mb-1">Cantidad a publicar</label>
                  <input
                    type="number"
                    min={1}
                    max={selectedTicket.quantity}
                    value={resellQuantity}
                    onChange={(e) => setResellQuantity(Number(e.target.value))}
                    className="w-full border px-3 py-2 rounded text-black"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={() => setShowResellModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Publicar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de transferencia */}
        {showTransferModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-black">Cambiar Datos del Ticket</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Cambiar el nombre y RUT asociado a este ticket (permanecerá en tu cuenta)
              </p>
              <form onSubmit={handleTransfer}>
                <div className="mb-4">
                  <label className="block text-black mb-1">Nuevo RUT</label>
                  <input
                    type="text"
                    value={transferId}
                    onChange={(e) => setTransferId(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-black"
                    placeholder="12345678-9"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-black mb-1">Nuevo Nombre</label>
                  <input
                    type="text"
                    value={transferName}
                    onChange={(e) => setTransferName(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-black"
                    placeholder="Nombre completo"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={() => setShowTransferModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Actualizar Datos
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}