import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { GameLayout } from '@/components/layout/GameLayout';
import { DashboardPage, PortfolioPage, CareerPage, HistoryPage } from '@/pages';
import { EventModal } from '@/components/game/EventModal';
import { useUIStore } from '@/store';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotificationsPanel } from '@/components/game/NotificationsPanel';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { UIState } from './store/uiStore';
import { GameResultModal } from './components/game/GameResultModal';
import { NotificationsContainer } from './components/ui';
import { ThemeSync } from '@/components/theme/ThemeSync'
import { AchievementsPage } from './pages/AchievementsPage';

const SyncRouteToUI: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setActiveView = useUIStore(state => state.setActiveView);
  const activeView = useUIStore(state => state.activeView);

  React.useEffect(() => {
    const path = location.pathname.substring(1) || 'dashboard';

    const validViews: Array<UIState['activeView']> = [
      'dashboard',
      'invest',
      'career',
      'history',
      'settings',
      'help',
      'expenses',
      'achievements',
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (validViews.includes(path as any)) {
      if (activeView !== path) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setActiveView(path as any);
      }
    } else {
      // Неверный маршрут → редирект на /dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate, setActiveView, activeView]);

  return null;
};

const SyncUIToRoute: React.FC = () => {
  const navigate = useNavigate();
  const activeView = useUIStore(state => state.activeView);

  React.useEffect(() => {
    const path = `/${activeView}`;
    if (location.pathname !== path) {
      navigate(path, { replace: false });
    }
  }, [activeView, navigate]);

  return null;
};

function App() {
  const { notifications, removeNotification, areNotificationsEnabled } = useUIStore();
  return (
    <BrowserRouter>
      <SyncRouteToUI />
      <SyncUIToRoute />
      <ThemeSync />
      <GameLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/invest" element={<PortfolioPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<div>Помощь (в разработке)</div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </GameLayout>

      <EventModal />

      <GameResultModal />
      {areNotificationsEnabled && (
        <NotificationsContainer
          notifications={notifications}
          onClose={removeNotification}
          position="top-center"
          maxNotifications={3}
        />
      )}

      {areNotificationsEnabled && <NotificationsPanel />}
    </BrowserRouter>
  );
}

export default App;
