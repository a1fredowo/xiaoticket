"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar el menú desplegable

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser.split("@")[0]); // Mostrar la parte antes del "@"
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <header className="bg-gray-900 p-4 shadow-2xl">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-white">XiaoTicket</h1>

        {/* Botón hamburguesa para móviles */}
        <button
          className="text-white md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Menú de navegación (oculto en móviles, visible en tablets y desktop) */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-slate-300 hover:bg-blue-400 hover:text-black px-3 py-2 rounded-lg transition">
            Inicio
          </Link>
          <Link href="/eventos" className="text-slate-300 hover:bg-blue-400 hover:text-black px-3 py-2 rounded-lg transition">
            Eventos
          </Link>
          <Link href="/publicar" className="text-slate-300 hover:bg-blue-400 hover:text-black px-3 py-2 rounded-lg transition">
            Crear Evento
          </Link>
          <Link href="/etickets" className="text-slate-300 hover:bg-blue-400 hover:text-black px-3 py-2 rounded-lg transition">
            Mis E-Tickets
          </Link>
          <Link href="/reventa" className="text-slate-300 hover:bg-blue-400 hover:text-black px-3 py-2 rounded-lg transition">
            Reventa
          </Link>
          <Link href="/checkin" className="text-slate-300 hover:bg-blue-400 hover:text-black px-3 py-2 rounded-lg transition">
            Check-In
          </Link>
        </nav>

        {/* Botones de usuario */}
        <div className="hidden md:flex space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Hola, {user}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-400 rounded-lg text-slate-300 hover:bg-red-400 hover:text-black transition"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 border border-blue-400 rounded-lg text-slate-300 hover:bg-blue-400 hover:text-black transition"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {isMenuOpen && (
        <nav className="mt-4 md:hidden flex flex-col space-y-2">
          <Link href="/" className="text-slate-300 hover:bg-blue-400 hover:text-black px-3 py-2 rounded-lg transition">
            Inicio
          </Link>
          <Link href="/eventos" className="text-slate-300 hover:bg-blue-400 hover:text-black px-3 py-2 rounded-lg transition">
            Eventos
          </Link>
          <Link href="/publicar" className="text-slate-300 hover:bg-blue-400 hover:text-black px-3 py-2 rounded-lg transition">
            Publicar
          </Link>
          <Link href="#" className="text-slate-300 hover:bg-blue-400 hover:text-black px-3 py-2 rounded-lg transition">
            Blog
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-400 rounded-lg text-slate-300 hover:bg-red-400 hover:text-black transition"
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 border border-blue-400 rounded-lg text-slate-300 hover:bg-blue-400 hover:text-black transition"
            >
              Iniciar Sesión
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}