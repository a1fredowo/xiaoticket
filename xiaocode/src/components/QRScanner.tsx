import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ 
  onResult, 
  isActive 
}: { 
  onResult: (data: string) => void;
  isActive: boolean;
}) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const html5QrRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!isActive) {
      stopScanner();
      return;
    }

    const startScanner = async () => {
      if (!qrRef.current || isScanning || !isActive || !isMountedRef.current) return;

      try {
        setIsScanning(true);
        setError(null);
        hasScannedRef.current = false;

        const elementId = `qr-reader-${Date.now()}`;
        qrRef.current.id = elementId;

        // Verificar que el elemento existe antes de crear el scanner
        const element = document.getElementById(elementId);
        if (!element) return;

        html5QrRef.current = new Html5Qrcode(elementId);

        await html5QrRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (!hasScannedRef.current && isMountedRef.current) {
              hasScannedRef.current = true;
              onResult(decodedText);
              // Detener el scanner después de un resultado exitoso
              setTimeout(() => stopScanner(), 100);
            }
          },
          (errorMessage) => {
            // Silenciar errores de escaneo normales
          }
        );
      } catch (err) {
        console.error("Error inicializando QR:", err);
        if (isMountedRef.current) {
          setError("Error al acceder a la cámara. Verifica los permisos.");
          setIsScanning(false);
        }
      }
    };

    const stopScanner = async () => {
      if (html5QrRef.current && isMountedRef.current) {
        try {
          // Verificar que el elemento DOM aún existe
          const elementId = qrRef.current?.id;
          const element = elementId ? document.getElementById(elementId) : null;
          
          if (element) {
            await html5QrRef.current.stop();
            await html5QrRef.current.clear();
          }
        } catch (err) {
          // Silenciar errores de cleanup
          console.warn("Error al limpiar scanner:", err);
        } finally {
          html5QrRef.current = null;
          if (isMountedRef.current) {
            setIsScanning(false);
          }
        }
      }
    };

    if (isActive) {
      startScanner();
    }

    return () => {
      isMountedRef.current = false;
      stopScanner();
    };
  }, [isActive, onResult]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <p className="text-gray-600 text-sm">
          Asegúrate de estar usando HTTPS y permitir el acceso a la cámara.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div ref={qrRef} style={{ width: "100%", minHeight: 250 }} />
      <p className="text-gray-600 text-sm mt-2">
        Escanea el QR del ticket para validar el ingreso.
      </p>
      {isScanning && (
        <p className="text-blue-600 text-sm mt-1">
          📹 Cámara activa - Enfoca el QR
        </p>
      )}
    </div>
  );
}