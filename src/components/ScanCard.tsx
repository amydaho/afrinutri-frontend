import { NutritionResult } from '@/types/nutrition';
import { useRouter } from 'next/navigation';

interface ScanCardProps {
  scan: NutritionResult;
}

export default function ScanCard({ scan }: ScanCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/results/${scan.id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-95"
    >
      <div className="relative h-32">
        <img
          src={scan.photoUrl}
          alt={scan.dishName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
          {scan.calories} kcal
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 truncate">{scan.dishName}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(scan.timestamp).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
          })}
        </p>
        
        <div className="flex gap-2 mt-2 text-xs">
          <span className="text-blue-600 font-medium">P: {scan.protein}g</span>
          <span className="text-amber-600 font-medium">G: {scan.carbs}g</span>
          <span className="text-red-600 font-medium">L: {scan.fat}g</span>
        </div>
      </div>
    </div>
  );
}
