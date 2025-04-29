import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db();

  try {
    // Buscar el evento en la base de datos por su ID
    const event = await db.collection("events").findOne({ id: params.id });

    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el evento:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}