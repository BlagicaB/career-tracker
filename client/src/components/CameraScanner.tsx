import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Scan, CreditCard } from "lucide-react";
import QrScanner from "qr-scanner";

interface CameraScannerProps {
  mode: "qr" | "businesscard";
  onScanComplete: (data: string) => void;
  onClose: () => void;
}

export function CameraScanner({ mode, onScanComplete, onClose }: CameraScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" } // Use back camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to access camera. Please grant camera permissions.");
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (qrScannerRef.current) {
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Initialize QR scanner if in QR mode
  useEffect(() => {
    if (mode === "qr" && isScanning && videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          onScanComplete(result.data);
          stopCamera();
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      
      qrScanner.start();
      qrScannerRef.current = qrScanner;

      return () => {
        qrScanner.destroy();
      };
    }
  }, [mode, isScanning, onScanComplete]);

  // Capture photo for business card scanning
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.9);
      onScanComplete(imageData);
      stopCamera();
    }
  };

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full">
        {/* Video stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          data-testid="video-camera-stream"
        />

        {/* Overlay UI */}
        <div className="absolute inset-0 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
            <div className="flex items-center gap-2 text-white">
              {mode === "qr" ? (
                <>
                  <Scan className="h-5 w-5" />
                  <span className="font-medium">Scan QR Code</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Scan Business Card</span>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
              data-testid="button-close-scanner"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Center guide */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative w-full max-w-md aspect-[3/2] border-4 border-white/50 rounded-lg">
              {mode === "qr" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center text-sm bg-black/50 px-3 py-2 rounded">
                    Position QR code in frame
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="p-6 bg-gradient-to-t from-black/70 to-transparent">
            {error && (
              <div className="mb-4 p-3 bg-red-500/90 text-white text-sm rounded-lg text-center">
                {error}
              </div>
            )}
            
            {mode === "businesscard" && isScanning && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={capturePhoto}
                  className="bg-white text-black hover:bg-white/90 rounded-full h-16 w-16 p-0"
                  data-testid="button-capture-photo"
                >
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            )}

            {mode === "qr" && (
              <div className="text-white text-center text-sm">
                QR code will be detected automatically
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
