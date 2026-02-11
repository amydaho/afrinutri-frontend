import Dexie, { type Table } from 'dexie';
import { NutritionResult } from '@/types/nutrition';

export class AfriNutriDB extends Dexie {
  scans!: Table<NutritionResult>;

  constructor() {
    super('AfriNutriDB');
    this.version(1).stores({
      scans: '++id, dishName, timestamp, synced',
    });
  }
}

export const db = new AfriNutriDB();

export async function addScan(scan: Omit<NutritionResult, 'id'>): Promise<number> {
  return await db.scans.add(scan as NutritionResult);
}

export async function getAllScans(): Promise<NutritionResult[]> {
  return await db.scans.orderBy('timestamp').reverse().toArray();
}

export async function getScanById(id: number): Promise<NutritionResult | undefined> {
  return await db.scans.get(id);
}

export async function deleteScan(id: number): Promise<void> {
  await db.scans.delete(id);
}

export async function searchScans(query: string): Promise<NutritionResult[]> {
  const lowerQuery = query.toLowerCase();
  return await db.scans
    .filter((scan) => 
      scan.dishName.toLowerCase().includes(lowerQuery) ||
      scan.ingredients.some((ing: string) => ing.toLowerCase().includes(lowerQuery))
    )
    .toArray();
}

export async function getRecentScans(limit: number = 5): Promise<NutritionResult[]> {
  return await db.scans.orderBy('timestamp').reverse().limit(limit).toArray();
}
