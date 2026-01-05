import { useUIStore } from '@/store/uiStore'
import { StartScreen } from '@/components/StartScreen'
import App from './App'

export const Root: React.FC = () => {
  const showStartScreen = useUIStore(state => state.showStartScreen)

  if (showStartScreen) {
    return <StartScreen />
  }

  return <App />
}