export interface IngredientWithWeight {
  name: string;
  weight: number;
}

export interface NutritionResult {
  id?: number;
  dishName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  mainIngredients?: string[];
  ingredientsWithWeight?: IngredientWithWeight[];
  photoUrl: string;
  timestamp: Date;
  synced: boolean;
  weight?: number;
  estimatedWeight?: number;
  confidence?: number;
}

export interface MacroNutrient {
  name: string;
  value: number;
  unit: string;
  color: string;
  percentage?: number;
}

export type ScanStatus = 'idle' | 'captured' | 'analyzing' | 'confirming' | 'complete' | 'error';
