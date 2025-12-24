import { TestGameStore } from './TestGameStore'
import './App.css'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        🎮 Financial Life Simulator
      </h1>
      <p className="text-gray-600 mb-8">
        Interactive financial education game. Manage your money, invest wisely, and grow your career!
      </p>
      
      <TestGameStore />
    </div>
  )
}

export default App