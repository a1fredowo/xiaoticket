import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email: payload.email });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ email: user.email, role: user.role });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}