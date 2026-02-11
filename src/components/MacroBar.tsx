interface MacroBarProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  maxValue?: number;
}

export default function MacroBar({ label, value, unit, color, maxValue = 100 }: MacroBarProps) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">
          {value}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
