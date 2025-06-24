import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  let email = "";
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    email = payload.email;
    if (!email) throw new Error("No email in token");
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const ventas = await db.collection("ventas").find({ email }).toArray();

  if (!ventas || ventas.length === 0) {
    return NextResponse.json({ tickets: [] });
  }

  const eventIDs = [...new Set(ventas.map((v: any) => v.eventId))];
  const eventos = await db
    .collection("events")
    .find({ id: { $in: eventIDs } })
    .toArray();

  const tickets = ventas.map((venta: any) => {
    const evento = eventos.find((e: any) => e.id === venta.eventId);
    return {
      ...venta,
      eventName: evento ? evento.title : "Evento no encontrado",
      eventLocation: evento ? evento.location : "",
      eventDate: evento ? evento.date : "",
      eventTime: evento ? evento.time : "",
    };
  });

  return NextResponse.json({ tickets });
}

export async function PATCH(req: NextRequest) {
  const { action, ticketId, newOwnerId, newOwnerName } = await req.json();
  
  if (action === "transfer") {
    const client = await clientPromise;
    const db = client.db();

    // Buscar el ticket original
    const venta = await db.collection("ventas").findOne({ _id: new ObjectId(ticketId) });
    if (!venta) {
      return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 });
    }

    // Simplemente actualizar los datos del comprador sin cambiar de cuenta
    await db.collection("ventas").updateOne(
      { _id: new ObjectId(ticketId) },
      {
        $set: {
          buyerName: newOwnerName,
          rut: newOwnerId,
        }
      }
    );

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}