"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllScans, deleteScan, searchScans } from "@/lib/db";
import { NutritionResult } from "@/types/nutrition";
import SearchBar from "@/components/SearchBar";
import HistoryItem from "@/components/HistoryItem";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const router = useRouter();
  const [scans, setScans] = useState<NutritionResult[]>([]);
  const [filteredScans, setFilteredScans] = useState<NutritionResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setFilteredScans(scans);
    }
  }, [searchQuery, scans]);

  async function loadScans() {
    try {
      const allScans = await getAllScans();
      setScans(allScans);
      setFilteredScans(allScans);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  async function performSearch(query: string) {
    try {
      const results = await searchScans(query);
      setFilteredScans(results);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteScan(id);
      setScans(scans.filter((s) => s.id !== id));
      toast.success("Scan supprimé");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size={48} text="Chargement..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Historique</h1>
        </div>
        
        <div className="px-4 pb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher un plat..."
          />
        </div>
      </div>

      <div className="px-4 py-4">
        {filteredScans.length > 0 ? (
          <div className="space-y-3">
            {filteredScans.map((scan) => (
              <HistoryItem
                key={scan.id}
                scan={scan}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery ? "Aucun résultat trouvé" : "Aucun scan pour le moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
