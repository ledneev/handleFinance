import { TestAssetCard } from './TestAssetCard';
import { StatusBar } from '@/components/game/StatusBar';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <StatusBar />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              🎮 Financial Life Simulator
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              StatusBar & AssetCard — Core game UI
            </p>
          </header>

          <TestAssetCard />

          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              StatusBar integrated! Next: Connect to Zustand, add mobile drawer.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
