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

  const { ticketId, price, quantity } = await req.json();
  if (!ticketId || !price || !quantity) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Buscar el ticket original (asegúrate de usar ObjectId si corresponde)
  const venta = await db.collection("ventas").findOne({ _id: new ObjectId(ticketId) });
  if (!venta) {
    return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 });
  }

  // Validar que el usuario tenga suficientes tickets
  if (venta.quantity < quantity) {
    return NextResponse.json({ error: "No tienes suficientes tickets para publicar" }, { status: 400 });
  }

  // Descontar la cantidad publicada en reventa
  await db.collection("ventas").updateOne(
    { _id: new ObjectId(ticketId) },
    { $inc: { quantity: -quantity } }
  );

  // Buscar el evento relacionado
  const evento = await db.collection("events").findOne({ id: venta.eventId });

  // Publicar en la colección de reventa
  const reventaDoc = {
    ticketId: venta._id,
    eventId: venta.eventId,
    eventName: evento?.title || "",
    eventLocation: evento?.location || "",
    eventDate: evento?.date || "",
    eventTime: evento?.time || "",
    packageType: venta.packageType,
    sellerEmail: venta.email,
    sellerName: venta.buyerName,
    price,
    quantity,
    createdAt: new Date(),
  };

  await db.collection("reventa").insertOne(reventaDoc);

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const publicaciones = await db.collection("reventa").find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ publicaciones });
}