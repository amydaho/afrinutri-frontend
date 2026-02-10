"use client";

import { useEffect, useRef, useState } from "react";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState(true);

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

    startCamera();
  }, []);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg");
    console.log("Image capturée :", imageData);
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

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <header className="p-4 text-white text-center font-semibold">
        Scanner un plat
      </header>

      {/* Camera preview */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
      </div>

      {/* Controls */}
      <div className="p-4 bg-black">
        <button
          onClick={takePhoto}
          className="w-full py-4 rounded-full bg-green-600 text-white text-lg font-semibold active:scale-95 transition"
        >
          Prendre la photo
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}