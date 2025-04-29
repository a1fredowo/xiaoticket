"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para el spinner
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true); // Mostrar el spinner

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Inicio de sesión exitoso");
        localStorage.setItem("token", data.token); // Guardar el token en localStorage
        localStorage.setItem("user", email); // Guardar el email del usuario
        setTimeout(() => {
          router.push("/"); // Redirigir al home
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false); // Ocultar el spinner
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {isLoading && <Spinner />} {/* Mostrar el spinner si isLoading es true */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Iniciar Sesión</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}