import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role }, 
    process.env.JWT_SECRET as string, 
    { expiresIn: "7d" }
  );

  return NextResponse.json({ 
    token, 
    user: { 
      email: user.email, 
      role: user.role 
    } 
  });
}