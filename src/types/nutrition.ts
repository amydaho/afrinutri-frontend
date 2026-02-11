export interface NutritionResult {
  id?: number;
  dishName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  photoUrl: string;
  timestamp: Date;
  synced: boolean;
}

export interface MacroNutrient {
  name: string;
  value: number;
  unit: string;
  color: string;
  percentage?: number;
}

export type ScanStatus = 'idle' | 'captured' | 'analyzing' | 'complete' | 'error';
