import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function withRole(requiredRole: string, handler: any) {
  return async (req: NextRequest, ...args: any[]) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      if (payload.role !== requiredRole) {
        return NextResponse.json({ error: "No tienes permisos" }, { status: 403 });
      }
      // Pasa el payload al handler si lo necesitas
      return handler(req, ...args);
    } catch {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
  };
}