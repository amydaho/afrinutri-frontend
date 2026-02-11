import { useState } from 'react';
import { X, Plus, Scale } from 'lucide-react';
import Button from './Button';
import { IngredientWithWeight } from '@/types/nutrition';

interface IngredientEditorProps {
  mainIngredients: string[];
  allIngredients: string[];
  onConfirm: (ingredientsWithWeight: IngredientWithWeight[]) => void;
  onCancel: () => void;
}

export default function IngredientEditor({ mainIngredients, allIngredients, onConfirm, onCancel }: IngredientEditorProps) {
  const [ingredientsWithWeight, setIngredientsWithWeight] = useState<IngredientWithWeight[]>(
    mainIngredients.map(name => ({ name, weight: 100 }))
  );
  const [newIngredient, setNewIngredient] = useState('');
  const [newWeight, setNewWeight] = useState<string>('100');

  const removeIngredient = (index: number) => {
    setIngredientsWithWeight(ingredientsWithWeight.filter((_, i) => i !== index));
  };

  const updateWeight = (index: number, value: string) => {
    const updated = [...ingredientsWithWeight];
    updated[index].weight = value === '' ? 0 : parseFloat(value) || 0;
    setIngredientsWithWeight(updated);
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredientsWithWeight([
        ...ingredientsWithWeight,
        { name: newIngredient.trim(), weight: parseFloat(newWeight) || 100 }
      ]);
      setNewIngredient('');
      setNewWeight('100');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Poids des composants principaux</h2>
          <p className="text-sm text-gray-600 mt-1">
            Indiquez le poids des éléments visibles du plat
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-2">
            {ingredientsWithWeight.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-green-50 rounded-lg p-3"
              >
                <span className="flex-1 text-gray-900 font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <Scale size={14} className="text-gray-400" />
                  <input
                    type="number"
                    value={item.weight === 0 ? '' : item.weight}
                    onChange={(e) => updateWeight(index, e.target.value)}
                    min="1"
                    max="5000"
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-xs text-gray-500">g</span>
                </div>
                <button
                  onClick={() => removeIngredient(index)}
                  className="p-1 hover:bg-red-100 rounded-full transition text-red-600"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700">
              Ajouter un ingrédient
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ex: Piment, Gingembre..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="100"
                min="1"
                max="5000"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="flex items-center text-sm text-gray-500">g</span>
              <button
                onClick={addIngredient}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Ajoutez d'autres composants visibles si nécessaire
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Autres ingrédients (inclus dans le calcul) :
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allIngredients.map((ing, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                  {ing}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ces ingrédients sont pris en compte dans les valeurs nutritionnelles
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 space-y-3">
          <div className="text-sm text-gray-600 mb-2">
            <strong>Poids total :</strong> {ingredientsWithWeight.reduce((sum, item) => sum + item.weight, 0)}g
          </div>
          <Button 
            onClick={() => onConfirm(ingredientsWithWeight)} 
            size="lg" 
            fullWidth
            disabled={ingredientsWithWeight.length === 0 || ingredientsWithWeight.some(item => item.weight <= 0)}
          >
            Confirmer et sauvegarder
          </Button>
          <Button onClick={onCancel} size="lg" fullWidth variant="outline">
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
