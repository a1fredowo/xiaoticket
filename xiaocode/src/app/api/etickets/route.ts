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
  let emailHash = "";
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    emailHash = payload.emailHash;
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Buscar el usuario por emailHash para obtener el email real
  const user = await db.collection("users").findOne({ emailHash });
  if (!user || !user.email) {
    return NextResponse.json({ error: "Usuario o email no encontrado" }, { status: 404 });
  }
  const email = user.email;
  console.log("Email del usuario autenticado:", email);

  // Buscar ventas por email en texto plano
  const ventas = await db.collection("ventas").find({ email }).toArray();
  console.log("Ventas encontradas:", ventas);

  if (!ventas || ventas.length === 0) {
    return NextResponse.json({ tickets: [] });
  }

  // Obtener los eventIds únicos
  const eventIDs = [...new Set(ventas.map((v: any) => v.eventId))];
  console.log("eventIDs:", eventIDs);

  // Buscar los eventos relacionados (el campo correcto es "id")
  const eventos = await db
    .collection("events")
    .find({ id: { $in: eventIDs } })
    .toArray();
  console.log("Eventos encontrados:", eventos);

  // Mapear ventas con nombre del evento
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
          // Mantener el mismo email (no cambiar de cuenta)
        }
      }
    );

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}