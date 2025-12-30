import React from 'react';

interface ProgressBarProps {
  value: number;
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500'
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  color = 'blue'
}) => {
  return (
    <div
      className="flex-1 max-w-xs"
      title={label}
    >
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};
