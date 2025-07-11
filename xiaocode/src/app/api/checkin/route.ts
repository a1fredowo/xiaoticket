import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";
import { withRole } from "@/middleware/roleGuard";

export async function POST(req: NextRequest) {
  const { eventId, rut } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  try {
    // Busca si el RUT ya hizo check-in para este evento
    const existing = await db.collection("checkins").findOne({ eventId, rut });
    if (existing) {
      return NextResponse.json({ error: "Este RUT ya hizo check-in" }, { status: 409 });
    }

    await db.collection("checkins").insertOne({ eventId, rut, timestamp: new Date() });

    // Cuenta total de check-ins para el evento
    const count = await db.collection("checkins").countDocuments({ eventId });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error en check-in:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export const POST = withRole("admin", async (req: NextRequest) => {
  const { eventId, rut } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  try {
    // Busca si el RUT ya hizo check-in para este evento
    const existing = await db.collection("checkins").findOne({ eventId, rut });
    if (existing) {
      return NextResponse.json({ error: "Este RUT ya hizo check-in" }, { status: 409 });
    }

    await db.collection("checkins").insertOne({ eventId, rut, timestamp: new Date() });

    // Cuenta total de check-ins para el evento
    const count = await db.collection("checkins").countDocuments({ eventId });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error en check-in:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
});

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId");
  
  if (!eventId) {
    return NextResponse.json({ error: "eventId es requerido" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    // Cuenta total de check-ins para el evento específico
    const count = await db.collection("checkins").countDocuments({ eventId });
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error al obtener aforo:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}