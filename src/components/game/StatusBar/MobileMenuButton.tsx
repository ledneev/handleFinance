import React from 'react';
import { useUIStore } from '@/store';
import {MoreVertical} from 'lucide-react';


export const MobileMenuButton: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <button
      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      aria-label={isSidebarOpen ? 'Закрыть меню' : 'Открыть меню'}
      onClick={toggleSidebar}
    >
      <MoreVertical className="w-5 h-5" />
    </button>
  );
};
