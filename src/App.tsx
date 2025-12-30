// src/App.tsx
import { GameLayout } from '@/components/layout/GameLayout';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { EventModal } from '@/components/game/EventModal';

function App() {
  return (
    <>
      <GameLayout>
        <PortfolioPage />
      </GameLayout>
      <EventModal />
    </>
  );
}

export default App;
