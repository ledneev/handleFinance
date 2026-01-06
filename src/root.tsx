import { useUIStore } from '@/store/uiStore'
import { StartScreen } from '@/components/StartScreen'
import App from './App'
import { useGameStore } from './store'

export const Root: React.FC = () => {
  const hasGameStarted = useUIStore(state => state.hasGameStarted)
  const gameSettings = useGameStore(state => state.gameSettings)

  if (!hasGameStarted || !gameSettings) {
    return <StartScreen />
  }

  return <App />
}