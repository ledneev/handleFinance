import { StartScreen } from '@/components/StartScreen'
import App from './App'
import { useGameStore } from './store'

export const Root: React.FC = () => {
  const gameSettings = useGameStore(state => state.gameSettings)

  if (!gameSettings) {
    return <StartScreen />
  }

  return <App />
}