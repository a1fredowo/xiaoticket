import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  // Busca por el email en texto plano
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  // Crea token JWT con el email en texto plano
  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "2h" }
  );

  return NextResponse.json({ token });
}