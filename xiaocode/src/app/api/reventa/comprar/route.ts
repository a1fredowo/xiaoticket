import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  let emailHash = "";
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    emailHash = payload.emailHash;
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const { reventaId, quantity } = await req.json();
  if (!reventaId || !quantity) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Buscar usuario comprador
  const user = await db.collection("users").findOne({ emailHash });
  if (!user || !user.email) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // Buscar publicación de reventa
  const reventa = await db.collection("reventa").findOne({ _id: new ObjectId(reventaId) });
  if (!reventa) {
    return NextResponse.json({ error: "Publicación no encontrada" }, { status: 404 });
  }

  if (reventa.quantity < quantity) {
    return NextResponse.json({ error: "No hay suficiente cantidad disponible" }, { status: 400 });
  }

  // Descontar cantidad de la publicación de reventa
  await db.collection("reventa").updateOne(
    { _id: new ObjectId(reventaId) },
    { $inc: { quantity: -quantity } }
  );

  // Agregar ticket al comprador (en ventas)
  await db.collection("ventas").insertOne({
    eventId: reventa.eventId,
    packageType: reventa.packageType,
    buyerName: user.name || user.email,
    email: user.email,
    quantity,
    createdAt: new Date(),
    // Puedes agregar más campos si lo deseas
  });

  return NextResponse.json({ ok: true });
}