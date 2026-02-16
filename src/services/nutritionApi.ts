import { api } from './api';
import { NutritionResult } from '@/types/nutrition';

export interface AnalyzeImageResponse {
  dishName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  mainIngredients: string[];
}

export async function analyzeFood(imageData: string): Promise<NutritionResult> {
  try {
    // Convert base64 to blob
    const base64Data = imageData.split(',')[1];
    const blob = await fetch(imageData).then(r => r.blob());
    
    // Create FormData
    const formData = new FormData();
    formData.append('image', blob, 'dish.jpg');

    // Call backend API
    const response = await api.post<AnalyzeImageResponse>('/nutrition/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Transform response to NutritionResult
    return {
      ...response.data,
      photoUrl: imageData,
      timestamp: new Date(),
      synced: true,
    };
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw new Error('Failed to analyze food. Please try again.');
  }
}
