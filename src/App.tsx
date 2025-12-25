import { TestGameStore } from './TestGameStore'
import { TestUIStore } from './testUIStore'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        🎮 Financial Life Simulator
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TestGameStore />
        <TestUIStore />
      </div>
    </div>
  )
}

export default App