"use client";

import { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { NutritionResult } from "@/types/nutrition";

interface NutritionValidationProps {
  result: NutritionResult;
  onConfirm: (validatedResult: NutritionResult) => void;
  onCancel: () => void;
}

type PortionSize = "small" | "medium" | "large";

const PORTION_MULTIPLIERS = {
  small: 0.7,
  medium: 1.0,
  large: 1.5,
};

export default function NutritionValidation({
  result,
  onConfirm,
  onCancel,
}: NutritionValidationProps) {
  const [ingredients, setIngredients] = useState<string[]>(
    result.ingredients || []
  );
  const [newIngredient, setNewIngredient] = useState("");
  const [portionSize, setPortionSize] = useState<PortionSize>("medium");
  const [customWeight, setCustomWeight] = useState<number>(
    result.estimatedWeight || 250
  );

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const calculateNutrition = () => {
    const multiplier = PORTION_MULTIPLIERS[portionSize];
    const baseWeight = result.estimatedWeight || 250;
    const finalWeight = portionSize === "medium" ? customWeight : baseWeight * multiplier;
    const ratio = finalWeight / 100; // Nutritional values are per 100g

    return {
      weight: Math.round(finalWeight),
      calories: Math.round(result.calories * ratio),
      protein: Math.round(result.protein * ratio),
      carbs: Math.round(result.carbs * ratio),
      fat: Math.round(result.fat * ratio),
      fiber: Math.round(result.fiber * ratio),
    };
  };

  const handleConfirm = () => {
    const nutrition = calculateNutrition();
    
    const validatedResult: NutritionResult = {
      ...result,
      ingredients,
      weight: nutrition.weight,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
    };

    onConfirm(validatedResult);
  };

  const nutrition = calculateNutrition();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Valider l'analyse
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Dish name */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">
              {result.dishName}
            </h3>
            {result.confidence && (
              <p className="text-sm text-gray-600">
                Confiance: {result.confidence}%
              </p>
            )}
          </div>

          {/* Portion size selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Taille de la portion
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => setPortionSize("small")}
                className={`py-2 px-4 rounded-lg border-2 transition-colors font-medium ${
                  portionSize === "small"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-400 text-gray-800 hover:border-primary"
                }`}
              >
                Petite
              </button>
              <button
                onClick={() => setPortionSize("medium")}
                className={`py-2 px-4 rounded-lg border-2 transition-colors font-medium ${
                  portionSize === "medium"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-400 text-gray-800 hover:border-primary"
                }`}
              >
                Moyenne
              </button>
              <button
                onClick={() => setPortionSize("large")}
                className={`py-2 px-4 rounded-lg border-2 transition-colors font-medium ${
                  portionSize === "large"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-400 text-gray-800 hover:border-primary"
                }`}
              >
                Grande
              </button>
            </div>

            {portionSize === "medium" && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poids personnalisé (g)
                </label>
                <input
                  type="number"
                  value={customWeight}
                  onChange={(e) => setCustomWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  min="50"
                  max="1000"
                />
              </div>
            )}

            <p className="text-sm font-medium text-gray-700 mt-2">
              Poids estimé: {nutrition.weight}g
            </p>
          </div>

          {/* Nutritional summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">
              Valeurs nutritionnelles
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Calories:</span>
                <span className="ml-2 font-semibold">{nutrition.calories} kcal</span>
              </div>
              <div>
                <span className="text-gray-600">Protéines:</span>
                <span className="ml-2 font-semibold">{nutrition.protein}g</span>
              </div>
              <div>
                <span className="text-gray-600">Glucides:</span>
                <span className="ml-2 font-semibold">{nutrition.carbs}g</span>
              </div>
              <div>
                <span className="text-gray-600">Lipides:</span>
                <span className="ml-2 font-semibold">{nutrition.fat}g</span>
              </div>
            </div>
          </div>

          {/* Ingredients editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Ingrédients détectés
            </label>
            
            <div className="space-y-2 mb-3">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-900 font-medium">{ingredient}</span>
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddIngredient()}
                placeholder="Ajouter un ingrédient..."
                className="flex-1 px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
              />
              <button
                onClick={handleAddIngredient}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-400 text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
