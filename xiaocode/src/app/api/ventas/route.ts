import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";

export async function POST(req: NextRequest) {
  const { eventId, packageType, quantity, rut, buyerName, email, billingAddress } = await req.json();

  if (!eventId || !packageType || !quantity || !rut || !buyerName || !email) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const venta = {
    eventId,
    packageType,
    quantity,
    rut,
    buyerName,
    email,
    billingAddress,
    createdAt: new Date(),
  };

  await db.collection("ventas").insertOne(venta);

  return NextResponse.json({ message: "Venta registrada", venta }, { status: 201 });
}