import { NutritionResult } from '@/types/nutrition';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface HistoryItemProps {
  scan: NutritionResult;
  onDelete: (id: number) => void;
}

export default function HistoryItem({ scan, onDelete }: HistoryItemProps) {
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scan.id && confirm(`Supprimer "${scan.dishName}" ?`)) {
      onDelete(scan.id);
    }
  };

  return (
    <div
      onClick={() => router.push(`/results/${scan.id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 flex"
    >
      <img
        src={scan.photoUrl}
        alt={scan.dishName}
        className="w-24 h-24 object-cover"
      />
      
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{scan.dishName}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(scan.timestamp).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-xs">
            <span className="text-green-600 font-bold">{scan.calories} kcal</span>
            <span className="text-gray-400">•</span>
            <span className="text-blue-600">P: {scan.protein}g</span>
            <span className="text-amber-600">G: {scan.carbs}g</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="px-4 flex items-center justify-center text-red-500 hover:bg-red-50 transition"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
