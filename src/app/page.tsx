"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, History, TrendingUp } from "lucide-react";
import { getRecentScans } from "@/lib/db";
import { NutritionResult } from "@/types/nutrition";
import Button from "@/components/Button";
import ScanCard from "@/components/ScanCard";
import DailyCaloriesSummary from "@/components/DailyCaloriesSummary";

export default function Home() {
  const router = useRouter();
  const [recentScans, setRecentScans] = useState<NutritionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentScans() {
      try {
        const scans = await getRecentScans(5);
        setRecentScans(scans);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRecentScans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Afri<span className="text-green-600">Nutri</span>
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Scannez vos plats africains et découvrez leurs valeurs nutritionnelles instantanément
            </p>
          </div>

          {/* Daily Calories Summary */}
          <DailyCaloriesSummary />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/scan")}
              size="lg"
              fullWidth
            >
              <Camera className="inline mr-2" size={24} />
              Scanner un plat
            </Button>

            {recentScans.length > 0 && (
              <Button
                onClick={() => router.push("/history")}
                size="lg"
                fullWidth
                variant="outline"
              >
                <History className="inline mr-2" size={20} />
                Voir l'historique
              </Button>
            )}
          </div>

          {/* Recent Scans */}
          {!loading && recentScans.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Derniers scans
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {recentScans.map((scan) => (
                  <ScanCard key={scan.id} scan={scan} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && recentScans.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-500">
                Aucun scan pour le moment
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Commencez par scanner votre premier plat !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}