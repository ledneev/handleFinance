import { create } from 'zustand';
import type { GameEvent } from '@/types/game.types';

// ====================== ТИПЫ ======================

export type Theme = 'light' | 'dark';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type ModalType = 'event' | 'confirm' | 'info' | null;

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

export interface ModalState<T = unknown> {
  isOpen: boolean;
  type: ModalType;
  data?: T;
}

export interface ConfirmModalData {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export interface InfoModalData {
  title: string;
  message: string;
}

// ====================== СОСТОЯНИЕ И ДЕЙСТВИЯ ======================

export interface UIState {
  theme: Theme;

  modal: ModalState;

  notifications: Notification[];

  isLoading: boolean;
  loadingText?: string;

  isSidebarOpen: boolean;
  activeView: 'dashboard' | 'invest' | 'career' | 'history' | 'settings' | 'help' | 'expenses' | 'achievements';
  showStartScreen: boolean;
  hasGameStarted: boolean;

  areNotificationsEnabled: boolean;
}

interface UIActions {
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;

  openModal: <T = unknown>(type: ModalType, data?: T) => void;
  closeModal: () => void;

  openEventModal: (event: GameEvent) => void;
  openConfirmModal: (data: ConfirmModalData) => void;
  openInfoModal: (data: InfoModalData) => void;

  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  toggleNotifications: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;

  startLoading: (text?: string) => void;
  stopLoading: () => void;

  toggleSidebar: () => void;
  setActiveView: (view: UIState['activeView']) => void;
  setShowStartScreen: (show: boolean) => void;

  setHasGameStarted: (started: boolean) => void;
}

export type UIStore = UIState & UIActions;

// ====================== СОЗДАНИЕ ХРАНИЛИЩА ======================

const initialState: UIState = {
  theme: 'light',
  modal: { isOpen: false, type: null },
  notifications: [],
  isLoading: false,
  isSidebarOpen: false,
  activeView: 'dashboard',
  showStartScreen: true,
  hasGameStarted: false,
  areNotificationsEnabled: true,
};

export const useUIStore = create<UIStore>((set, get) => ({
  ...initialState,

  toggleTheme: () => {
    set(state => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  },

  setTheme: theme => {
    set({ theme });
    localStorage.setItem('theme', theme);
  },

  openModal: (type, data) => {
    set({
      modal: { isOpen: true, type, data },
    });
  },

  closeModal: () => {
    set({
      modal: { isOpen: false, type: null },
    });
  },

  openEventModal: event => {
    get().openModal('event', event);
  },

  openConfirmModal: data => {
    get().openModal('confirm', data);
  },

  openInfoModal: data => {
    get().openModal('info', data);
  },

  addNotification: notification => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };

    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));

    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration);
    }
  },

  removeNotification: id => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  toggleNotifications: () => {
    set(state => ({ areNotificationsEnabled: !state.areNotificationsEnabled }));
  },

  setNotificationsEnabled: enabled => {
    set({ areNotificationsEnabled: enabled });
  },

  startLoading: text => {
    set({ isLoading: true, loadingText: text });
  },

  stopLoading: () => {
    set({ isLoading: false, loadingText: undefined });
  },

  toggleSidebar: () => {
    set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setShowStartScreen: show => {
    set({ showStartScreen: show });
  },

  setActiveView: view => {
    set({ activeView: view });
  },

  setHasGameStarted: (started: boolean) => {
    set({ hasGameStarted: started, showStartScreen: !started });
  },
}));

// ====================== УТИЛИТЫ ======================

export const notify = {
  info: (title: string, message: string, duration?: number) => {
    useUIStore.getState().addNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  },

  success: (title: string, message: string, duration?: number) => {
    useUIStore.getState().addNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  },

  warning: (title: string, message: string, duration?: number) => {
    useUIStore.getState().addNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  },

  error: (title: string, message: string, duration?: number) => {
    useUIStore.getState().addNotification({
      type: 'error',
      title,
      message,
      duration,
    });
  },
};

// Хелпер для проверки типа модалки (Type Guard)
export const isEventModal = (modal: ModalState): modal is ModalState<GameEvent> => {
  return modal.type === 'event';
};

export const isConfirmModal = (modal: ModalState): modal is ModalState<ConfirmModalData> => {
  return modal.type === 'confirm';
};

export const isInfoModal = (
  modal: ModalState
): modal is ModalState<InfoModalData> & { data: InfoModalData } => {
  return modal.type === 'info' && !!modal.data;
};

// Хелпер для безопасного получения данных модалки
export const getModalData = <T = unknown>(modal: ModalState): T | undefined => {
  return modal.data as T;
};
