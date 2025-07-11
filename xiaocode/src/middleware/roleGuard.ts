import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "@/utils/mongodb";

export function withRole(requiredRole: string, handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      
      // Validar rol en la base de datos
      const client = await clientPromise;
      const db = client.db();
      const user = await db.collection("users").findOne({ email: payload.email });
      
      if (!user || user.role !== requiredRole) {
        return NextResponse.json({ error: "Sin permisos de administrador" }, { status: 403 });
      }
      
      return handler(req);
    } catch (error) {
      console.error("Error de autenticación:", error);
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
  };
}