"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Validaciones
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (password: string) =>
    /^(?=.*[0-9]).{8,}$/.test(password);

  // Validación en tiempo real para email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!isValidEmail(value)) {
      setEmailError("El correo electrónico no es válido.");
    } else {
      setEmailError("");
    }
  };

  // Validación en tiempo real para contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!isStrongPassword(value)) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres y contener al menos un número.");
    } else {
      setPasswordError("");
    }
    // También valida confirmación si ya hay valor
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Validación en tiempo real para confirmación de contraseña
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (password !== value) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validación final antes de enviar
    if (!isValidEmail(email)) {
      setEmailError("El correo electrónico no es válido.");
      return;
    }
    if (!isStrongPassword(password)) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres y contener al menos un número.");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setSuccess("Usuario registrado exitosamente");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Error al registrar el usuario");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {isLoading && <Spinner />}
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Crear Cuenta</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Correo Electrónico
            </label>
            {emailError && <p className="text-red-500 text-xs mb-1">{emailError}</p>}
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            {passwordError && <p className="text-red-500 text-xs mb-1">{passwordError}</p>}
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={8}
              pattern="^(?=.*[0-9]).{8,}$"
              title="Al menos 8 caracteres y un número"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirmar Contraseña
            </label>
            {confirmPasswordError && <p className="text-red-500 text-xs mb-1">{confirmPasswordError}</p>}
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={8}
              pattern="^(?=.*[0-9]).{8,}$"
              title="Al menos 8 caracteres y un número"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}