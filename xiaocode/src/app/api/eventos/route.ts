import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";
import { v4 as uuidv4 } from "uuid"; // Importar uuid para generar IDs únicas
import { withRole } from "@/middleware/roleGuard";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const events = await db.collection("events").find().toArray();
  return NextResponse.json(events);
}

export const POST = withRole("admin", async (req: NextRequest) => {
  const { title, location, date, time, image, packages } = await req.json();

  if (!title || !location || !date || !time || !packages) {
    return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const newEvent = {
    id: uuidv4(), // Generar una ID única
    title,
    location,
    date,
    time,
    image: image || "https://placehold.co/600x400", // Imagen por defecto
    packages,
  };

  await db.collection("events").insertOne(newEvent);

  return NextResponse.json({ message: "Evento publicado exitosamente", event: newEvent }, { status: 201 });
});