"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConfirmacionPage() {
  const searchParams = useSearchParams();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(searchParams.get("data") || "{}");
    setConfirmationData(data);

    // Generar el QR
    const qrData = `Evento: ${data.eventName}, Paquete: ${data.package}, Cantidad: ${data.quantity}, Comprador: ${data.buyer}`;
    QRCode.toDataURL(qrData).then((url) => setQrCodeUrl(url));
  }, [searchParams]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Confirmación de Compra", 20, 20);
    doc.setFontSize(12);
    doc.text(`Evento: ${confirmationData.eventName}`, 20, 40);
    doc.text(`Paquete: ${confirmationData.package}`, 20, 50);
    doc.text(`Cantidad: ${confirmationData.quantity}`, 20, 60);
    doc.text(`Comprador: ${confirmationData.buyer}`, 20, 70);
    if (qrCodeUrl) {
      doc.addImage(qrCodeUrl, "PNG", 20, 80, 50, 50);
    }
    doc.save("confirmacion_compra.pdf");
  };

  if (!confirmationData) return <p>Cargando...</p>;

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-6">Confirmación de Compra</h1>
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-black">
          <p><strong>Evento:</strong> {confirmationData.eventName}</p>
          <p><strong>Paquete:</strong> {confirmationData.package}</p>
          <p><strong>Cantidad:</strong> {confirmationData.quantity}</p>
          <p><strong>Comprador:</strong> {confirmationData.buyer}</p>
          {qrCodeUrl && <img src={qrCodeUrl} alt="Código QR" className="mx-auto my-4" />}
          <button
            onClick={handleDownloadPDF}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Descargar PDF
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}