"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function CuponesPage() {
  const [cupones, setCupones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCupones = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch("/api/cupones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.cupones) {
        setCupones(data.cupones);
      } else {
        console.error("Error al obtener cupones:", data.error || "Sin datos");
      }
      setLoading(false);
    };
    fetchCupones();
  }, []);

  const handleDownload = async (cupon: any) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("XiaoTicket: Cupón", 20, 20);
    doc.setFontSize(12);
    doc.text(`Evento: ${cupon.eventName}`, 20, 40);
    doc.text(`Producto: ${cupon.product}`, 20, 50);
    doc.text(`Código: ${cupon.code}`, 20, 60);

    const qrData = `Evento: ${cupon.eventName}, Producto: ${cupon.product}, Código: ${cupon.code}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    doc.addImage(qrCodeUrl, "PNG", 130, 20, 50, 50);

    doc.save(`cupon_${cupon.product}.pdf`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6 text-white">Mis Cupones</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : cupones.length === 0 ? (
          <p>No tienes cupones disponibles.</p>
        ) : (
          <ul>
            {cupones.map((cupon, idx) => (
              <li key={idx} className="mb-4 p-4 border rounded-lg bg-white text-black">
                <p><strong>Evento:</strong> {cupon.eventName}</p>
                <p><strong>Producto:</strong> {cupon.product}</p>
                <p><strong>Código:</strong> {cupon.code}</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  onClick={() => handleDownload(cupon)}
                >
                  Descargar Cupón
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