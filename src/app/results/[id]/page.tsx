"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import { getScanById } from "@/lib/db";
import { NutritionResult } from "@/types/nutrition";
import NutritionCard from "@/components/NutritionCard";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [scan, setScan] = useState<NutritionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScan() {
      try {
        const id = parseInt(params.id as string);
        const result = await getScanById(id);
        
        if (result) {
          setScan(result);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadScan();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size={48} text="Chargement..." />
      </div>
    );
  }

  if (!scan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="relative">
        <img
          src={scan.photoUrl}
          alt={scan.dishName}
          className="w-full h-64 object-cover"
        />
        
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{scan.dishName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-gray-500">
              Analysé le {new Date(scan.timestamp).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {scan.weight && (
              <>
                <span className="text-gray-300">•</span>
                <p className="text-sm font-medium text-green-600">
                  {scan.weight}g
                </p>
              </>
            )}
          </div>
        </div>

        <NutritionCard data={scan} />

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/scan")}
            size="lg"
            fullWidth
          >
            <Camera className="inline mr-2" size={20} />
            Nouveau scan
          </Button>
          
          <Button
            onClick={() => router.push("/")}
            size="lg"
            fullWidth
            variant="outline"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
