import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb"; // Ruta corregida
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Verifica si el usuario ya existe
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "El usuario ya existe" }, { status: 409 });
  }

  // Hashea la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Guarda el usuario
  await db.collection("users").insertOne({
    email,
    password: hashedPassword
  });

  return NextResponse.json({ message: "Usuario registrado correctamente" }, { status: 201 });
}