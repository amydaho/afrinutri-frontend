import { NutritionResult } from '@/types/nutrition';
import MacroBar from './MacroBar';

interface NutritionCardProps {
  data: NutritionResult;
}

export default function NutritionCard({ data }: NutritionCardProps) {
  const totalMacros = data.protein + data.carbs + data.fat;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="text-center pb-6 border-b border-gray-200">
        <div className="inline-flex items-baseline gap-2">
          <span className="text-5xl font-bold text-green-600">{data.calories}</span>
          <span className="text-xl text-gray-600">kcal</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Calories totales</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 text-lg">Macronutriments</h3>
        
        <MacroBar
          label="Protéines"
          value={data.protein}
          unit="g"
          color="#3b82f6"
          maxValue={totalMacros}
        />
        
        <MacroBar
          label="Glucides"
          value={data.carbs}
          unit="g"
          color="#f59e0b"
          maxValue={totalMacros}
        />
        
        <MacroBar
          label="Lipides"
          value={data.fat}
          unit="g"
          color="#ef4444"
          maxValue={totalMacros}
        />
        
        <MacroBar
          label="Fibres"
          value={data.fiber}
          unit="g"
          color="#10b981"
          maxValue={30}
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Ingrédients détectés</h3>
        <div className="flex flex-wrap gap-2">
          {data.ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium"
            >
              {ingredient}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
