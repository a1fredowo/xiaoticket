"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function MisTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [transferId, setTransferId] = useState("");
  const [transferName, setTransferName] = useState("");

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

  const handleDownload = async (ticket: any) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("XiaoTicket: E-Ticket", 20, 20);
    doc.setFontSize(12);
    doc.text(`Evento: ${ticket.eventName}`, 20, 40);
    doc.text(`Fecha: ${ticket.eventDate} - Hora: ${ticket.eventTime}`, 20, 50);
    doc.text(`Lugar: ${ticket.eventLocation}`, 20, 60);
    doc.text(`Paquete: ${ticket.packageType}`, 20, 70);
    doc.text(`Cantidad: ${ticket.quantity}`, 20, 80);
    doc.text(`Comprador: ${ticket.buyerName}`, 20, 90);
    doc.text(`RUT: ${ticket.rut}`, 20, 100);
    doc.text(`Correo: ${ticket.email}`, 20, 110);
    doc.text(`Dirección: ${ticket.billingAddress}`, 20, 120);

    // Generar QR con los datos principales
    const qrData = JSON.stringify({
      eventId: ticket.eventId,
      packageType: ticket.packageType,
      rut: ticket.rut,
      buyerName: ticket.buyerName,
    });
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    doc.addImage(qrCodeUrl, "PNG", 130, 20, 50, 50);

    doc.save(`eticket_${ticket.eventName}.pdf`);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/transferir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6 text-white">Mis E-Tickets</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : tickets.length === 0 ? (
          <p>No tienes tickets comprados.</p>
        ) : (
          <ul>
            {tickets.map((ticket, idx) => (
              <li key={idx} className="mb-4 p-4 border rounded-lg bg-white text-black">
                <p><strong>Evento:</strong> {ticket.eventName}</p>
                <p><strong>Fecha:</strong> {ticket.eventDate} - <strong>Hora:</strong> {ticket.eventTime}</p>
                <p><strong>Lugar:</strong> {ticket.eventLocation}</p>
                <p><strong>Paquete:</strong> {ticket.packageType}</p>
                <p><strong>Cantidad:</strong> {ticket.quantity}</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  onClick={() => handleDownload(ticket)}
                >
                  Descargar E-Ticket
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}