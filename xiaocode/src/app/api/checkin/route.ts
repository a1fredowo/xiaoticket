import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";
import { withRole } from "@/middleware/roleGuard";

// Función de check-in protegida por rol admin
async function handleCheckin(req: NextRequest) {
  const body = await req.json();
  const { eventId, rut, packageType, buyerName, isQRScan = false } = body;
  const client = await clientPromise;
  const db = client.db();

  try {
    // 🌐 Validación de datos requeridos
    if (!eventId || !rut) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // 🔍 Buscar el ticket en ventas
    const query: any = { eventId, rut };
    if (isQRScan && packageType && buyerName) {
      query.packageType = packageType;
      query.buyerName = buyerName;
    }

    const ticket = await db.collection("ventas").findOne(query);
    if (!ticket) {
      return NextResponse.json({ 
        error: "🔍 No coincide con la base de datos" 
      }, { status: 404 });
    }

    // 🚫 Validar que el evento coincida
    const event = await db.collection("events").findOne({ id: eventId });
    if (!event) {
      return NextResponse.json({ 
        error: "🚫 Evento incorrecto o no encontrado" 
      }, { status: 404 });
    }

    // ♻️ Verificar si ya hizo check-in
    const existing = await db.collection("checkins").findOne({ eventId, rut });
    if (existing) {
      return NextResponse.json({ 
        error: "♻️ Ticket ya utilizado - Check-in ya realizado" 
      }, { status: 409 });
    }

    // 🔒 Verificar aforo máximo
    const AFORO_MAXIMO = 100;
    const currentCount = await db.collection("checkins").countDocuments({ eventId });
    if (currentCount >= AFORO_MAXIMO) {
      return NextResponse.json({ 
        error: "🔒 Aforo superado - No se permite más ingreso" 
      }, { status: 403 });
    }

    // 🎟️ Validar tipo de entrada
    if (packageType && !isValidPackageForZone(packageType, eventId)) {
      return NextResponse.json({ 
        error: "🎟️ Tipo de entrada no válida para esta zona" 
      }, { status: 403 });
    }

    // ✅ Registrar check-in
    await db.collection("checkins").insertOne({ 
      eventId, 
      rut, 
      packageType: ticket.packageType,
      buyerName: ticket.buyerName,
      timestamp: new Date() 
    });

    // Actualizar contador
    const newCount = await db.collection("checkins").countDocuments({ eventId });

    return NextResponse.json({ 
      success: true, 
      count: newCount,
      message: "✅ Check-in exitoso"
    });

  } catch (error) {
    console.error("Error en check-in:", error);
    return NextResponse.json({ 
      error: "🌐 Error de conexión - Intenta nuevamente" 
    }, { status: 500 });
  }
}

// Exportar POST protegido con rol admin
export const POST = withRole("admin", handleCheckin);

// GET para obtener aforo (también protegido)
export const GET = withRole("admin", async (req: NextRequest) => {
  const eventId = req.nextUrl.searchParams.get("eventId");
  
  if (!eventId) {
    return NextResponse.json({ error: "eventId es requerido" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const count = await db.collection("checkins").countDocuments({ eventId });
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error al obtener aforo:", error);
    return NextResponse.json({ 
      error: "🌐 Error de conexión al obtener aforo" 
    }, { status: 500 });
  }
});

// Función para validar paquetes por zona
function isValidPackageForZone(packageType: string, eventId: string): boolean {
  const validPackages = ["ENGENE VIP", "MOA", "GENERAL"];
  return validPackages.includes(packageType);
}