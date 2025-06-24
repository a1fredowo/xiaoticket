import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";
import jwt from "jsonwebtoken";

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

  const cupones = await db.collection("cupones").find({ email }).toArray();

  return NextResponse.json({ cupones });
}

export async function POST(req: NextRequest) {
  const { cupones } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  await db.collection("cupones").insertMany(cupones);

  return NextResponse.json({ message: "Cupones generados exitosamente" }, { status: 201 });
}