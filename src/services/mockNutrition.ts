import { NutritionResult } from '@/types/nutrition';

const MOCK_DISHES: Omit<NutritionResult, 'id' | 'photoUrl' | 'timestamp' | 'synced'>[] = [
  {
    dishName: 'Jollof Rice',
    calories: 450,
    protein: 12,
    carbs: 75,
    fat: 10,
    fiber: 4,
    ingredients: ['Riz', 'Tomates', 'Oignons', 'Poivrons', 'Épices', 'Huile'],
    mainIngredients: ['Riz', 'Tomates', 'Poivrons'],
  },
  {
    dishName: 'Mafé (Sauce d\'arachide)',
    calories: 520,
    protein: 28,
    carbs: 45,
    fat: 22,
    fiber: 6,
    ingredients: ['Viande de bœuf', 'Pâte d\'arachide', 'Tomates', 'Oignons', 'Carottes', 'Chou'],
    mainIngredients: ['Sauce mafé', 'Riz', 'Carottes', 'Chou'],
  },
  {
    dishName: 'Thiéboudienne',
    calories: 580,
    protein: 35,
    carbs: 65,
    fat: 18,
    fiber: 5,
    ingredients: ['Poisson', 'Riz', 'Tomates', 'Carottes', 'Aubergines', 'Chou', 'Manioc'],
    mainIngredients: ['Poisson', 'Riz', 'Carottes', 'Chou', 'Manioc'],
  },
  {
    dishName: 'Poulet Yassa',
    calories: 420,
    protein: 38,
    carbs: 25,
    fat: 16,
    fiber: 3,
    ingredients: ['Poulet', 'Oignons', 'Citron', 'Moutarde', 'Huile d\'olive', 'Ail'],
    mainIngredients: ['Poulet', 'Oignons', 'Riz'],
  },
  {
    dishName: 'Alloco (Bananes plantain frites)',
    calories: 320,
    protein: 3,
    carbs: 55,
    fat: 12,
    fiber: 4,
    ingredients: ['Bananes plantain', 'Huile de palme', 'Piment', 'Oignons'],
    mainIngredients: ['Bananes plantain', 'Oignons'],
  },
  {
    dishName: 'Attiéké avec Poisson braisé',
    calories: 480,
    protein: 32,
    carbs: 58,
    fat: 14,
    fiber: 5,
    ingredients: ['Attiéké (semoule de manioc)', 'Poisson', 'Tomates', 'Oignons', 'Piment'],
    mainIngredients: ['Attiéké', 'Poisson', 'Tomates'],
  },
];

export async function analyzeFoodMock(imageData: string): Promise<NutritionResult> {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const randomDish = MOCK_DISHES[Math.floor(Math.random() * MOCK_DISHES.length)];

  return {
    ...randomDish,
    photoUrl: imageData,
    timestamp: new Date(),
    synced: false,
  };
}
