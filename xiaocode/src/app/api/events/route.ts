import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";

export async function GET(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db();
  
  try {
    const events = await db.collection("events").find({}).toArray();
    // Devuelve id y title (no name)
    return NextResponse.json(
      events.map(e => ({ 
        id: e.id || e._id.toString(), 
        title: e.title,
        name: e.title // Para compatibilidad
      }))
    );
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}