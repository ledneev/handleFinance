import { useUIStore } from '@/store'

export const useUI = () => {
  const {
    theme,
    toggleTheme,
    modal,
    openModal,
    closeModal,
    openEventModal,
    openConfirmModal,
    openInfoModal,
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    isLoading,
    startLoading,
    stopLoading,
    isSidebarOpen,
    toggleSidebar,
    activeView,
    setActiveView
  } = useUIStore()

  return {
    // Тема
    theme,
    toggleTheme,
    
    // Модалки (универсальные)
    modal,
    openModal,
    closeModal,
    
    // Модалки (специализированные хелперы)
    openEventModal,
    openConfirmModal,
    openInfoModal,
    
    // Уведомления
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    
    // Загрузки
    isLoading,
    startLoading,
    stopLoading,
    
    // Навигация
    isSidebarOpen,
    toggleSidebar,
    activeView,
    setActiveView
  }
}