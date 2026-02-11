"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, RotateCcw } from "lucide-react";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { compressImage } from "@/utils/imageCompression";
import { analyzeFoodMock } from "@/services/mockNutrition";
import { addScan } from "@/lib/db";
import toast from "react-hot-toast";
import { ScanStatus } from "@/types/nutrition";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error);
        setHasCamera(false);
      }
    }

    if (status === "idle") {
      startCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [status]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg");
    setCapturedImage(imageData);
    setStatus("captured");

    if (videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setStatus("idle");
  };

  const analyzePhoto = async () => {
    if (!capturedImage) return;

    setStatus("analyzing");

    try {
      const compressedImage = await compressImage(capturedImage, 1);
      const result = await analyzeFoodMock(compressedImage);
      const scanId = await addScan(result);

      toast.success(`${result.dishName} détecté !`);
      router.push(`/results/${scanId}`);
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast.error("Erreur lors de l'analyse");
      setStatus("captured");
    }
  };

  if (!hasCamera) {
    return (
      <div className="flex h-screen items-center justify-center text-center p-4">
        <div className="max-w-md">
          <p className="text-red-500 mb-4">
            Impossible d'accéder à la caméra.
          </p>
          <p className="text-sm text-gray-600">
            La caméra nécessite une connexion sécurisée (HTTPS) ou localhost.
            Accédez à l'application via <strong>http://localhost:3000</strong> au lieu de l'adresse IP réseau.
          </p>
        </div>
      </div>
    );
  }

  if (status === "analyzing") {
    return (
      <div className="flex flex-col h-screen bg-black items-center justify-center">
        <LoadingSpinner size={48} text="Analyse en cours..." className="text-white" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="p-4 text-white text-center font-semibold">
        Scanner un plat
      </header>

      <div className="flex-1 relative">
        {status === "idle" && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        )}

        {status === "captured" && capturedImage && (
          <img
            src={capturedImage}
            alt="Photo capturée"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="p-4 bg-black space-y-3">
        {status === "idle" && (
          <Button onClick={takePhoto} size="lg" fullWidth>
            <Camera className="inline mr-2" size={20} />
            Prendre la photo
          </Button>
        )}

        {status === "captured" && (
          <>
            <Button onClick={analyzePhoto} size="lg" fullWidth>
              Analyser
            </Button>
            <Button onClick={retakePhoto} size="lg" fullWidth variant="outline">
              <RotateCcw className="inline mr-2" size={20} />
              Reprendre
            </Button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}