import React from 'react';

interface StatusBarItemProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: string | number;
  tooltip?: string; // опциональный нативный tooltip
  onClick?: () => void;
}

export const StatusBarItem: React.FC<StatusBarItemProps> = ({
  icon,
  label,
  value,
  change,
  tooltip,
  onClick
}) => {
  return (
    <div
      className={`
        flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium
        bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors cursor-default group
      `}
      onClick={onClick}
      title={tooltip} // нативный tooltip
    >
      {icon && <span className="text-gray-600 dark:text-gray-300">{icon}</span>}

      <div className="text-gray-800 dark:text-gray-200 leading-tight">
        <div className="text-xs opacity-75 group-hover:opacity-100 transition-opacity">
          {label}
        </div>
        <div className="font-semibold">
          {value}
        </div>
        {change && (
          <div className="text-xs text-green-600 dark:text-green-400">
            {change}
          </div>
        )}
      </div>
    </div>
  );
};
