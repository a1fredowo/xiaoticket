import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    // Aquí puedes retornar datos protegidos
    return NextResponse.json({ message: "Acceso concedido", payload });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}