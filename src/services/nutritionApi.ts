import { api } from './api';
import { NutritionResult } from '@/types/nutrition';

export interface NutritionAnalysis {
  dishName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  mainIngredients: string[];
}

export interface AnalyzeImageResponse {
  analysis: NutritionAnalysis;
  scanId: string;
}

export async function analyzeFood(imageData: string): Promise<NutritionResult> {
  try {
    // Call backend API with base64 image
    const response = await api.post<AnalyzeImageResponse>('/nutrition/analyze-food', {
      userId: 'anonymous',
      image: imageData,
    });

    // Extract structured nutrition data from response
    const analysis = response.data.analysis;
    
    return {
      dishName: analysis.dishName,
      calories: analysis.calories,
      protein: analysis.protein,
      carbs: analysis.carbs,
      fat: analysis.fat,
      fiber: analysis.fiber,
      ingredients: analysis.ingredients,
      mainIngredients: analysis.mainIngredients,
      photoUrl: imageData,
      timestamp: new Date(),
      synced: true,
    };
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw new Error('Failed to analyze food. Please try again.');
  }
}
