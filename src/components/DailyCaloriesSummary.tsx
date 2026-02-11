import { useEffect, useState } from 'react';
import { Flame, TrendingUp, Edit2, Check, X } from 'lucide-react';
import { getTodayCalories, getTodayScans } from '@/lib/db';

const STORAGE_KEY = 'afrinutri_daily_target';
const DEFAULT_TARGET = 2000;

export default function DailyCaloriesSummary() {
  const [todayCalories, setTodayCalories] = useState(0);
  const [mealsCount, setMealsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dailyTarget, setDailyTarget] = useState(DEFAULT_TARGET);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(DEFAULT_TARGET.toString());

  useEffect(() => {
    // Load saved target from localStorage
    const savedTarget = localStorage.getItem(STORAGE_KEY);
    if (savedTarget) {
      const target = parseInt(savedTarget, 10);
      setDailyTarget(target);
      setEditValue(target.toString());
    }
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      const [calories, scans] = await Promise.all([
        getTodayCalories(),
        getTodayScans()
      ]);
      setTodayCalories(calories);
      setMealsCount(scans.length);
    } catch (error) {
      console.error('Erreur lors du chargement des données du jour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditValue(dailyTarget.toString());
  };

  const handleSave = () => {
    const newTarget = parseInt(editValue, 10);
    if (newTarget > 0 && newTarget <= 10000) {
      setDailyTarget(newTarget);
      localStorage.setItem(STORAGE_KEY, newTarget.toString());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(dailyTarget.toString());
  };

  const percentage = Math.min((todayCalories / dailyTarget) * 100, 100);
  const isOverTarget = todayCalories > dailyTarget;

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white animate-pulse">
        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame size={24} />
          <h3 className="text-lg font-bold">Calories du jour</h3>
        </div>
        <div className="text-sm opacity-90">
          {mealsCount} repas
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{todayCalories}</span>
          <span className="text-xl opacity-90">/</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-24 px-2 py-1 text-lg font-semibold bg-white/20 border border-white/40 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                min="500"
                max="10000"
                autoFocus
              />
              <span className="text-xl opacity-90">kcal</span>
              <button
                onClick={handleSave}
                className="p-1 hover:bg-white/20 rounded transition"
                title="Sauvegarder"
              >
                <Check size={20} />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-white/20 rounded transition"
                title="Annuler"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl opacity-90">{dailyTarget} kcal</span>
              <button
                onClick={handleEditClick}
                className="p-1 hover:bg-white/20 rounded transition"
                title="Modifier l'objectif"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isOverTarget ? 'bg-yellow-300' : 'bg-white'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Message */}
        <div className="flex items-center gap-2 text-sm">
          {isOverTarget ? (
            <>
              <TrendingUp size={16} />
              <span>Objectif dépassé de {todayCalories - dailyTarget} kcal</span>
            </>
          ) : (
            <>
              <TrendingUp size={16} />
              <span>Encore {dailyTarget - todayCalories} kcal disponibles</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
