"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ReventaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-8">Reventa y Transferencia de Tickets</h1>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <Link
            href="/reventa/comprar"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-lg text-xl font-semibold text-center transition"
          >
            Comprar Tickets de Reventa
          </Link>
          <Link
            href="/reventa/vender"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 rounded-lg text-xl font-semibold text-center transition"
          >
            Vender o Transferir Tickets
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}