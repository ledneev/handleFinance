import { TestUIComponents } from './TestUIComponents'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            🎮 Financial Life Simulator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            UI Components Test - Building the foundation
          </p>
        </header>
        
        <TestUIComponents />
        
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
            UI Components are ready! Next: Game-specific components.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App