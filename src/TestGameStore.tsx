import { useGameStore } from './store'

export function TestGameStore() {
  const {
    currentYear,
    balance,
    player,
    portfolio,
    advanceYear,
    buyAsset,
    addMoney,
    resetGame
  } = useGameStore()

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Game Store Test</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-gray-600">Current Year: <span className="font-semibold">{currentYear}</span></p>
          <p className="text-gray-600">Balance: <span className="font-semibold">{balance.toLocaleString()}₽</span></p>
          <p className="text-gray-600">Career: <span className="font-semibold capitalize">{player.career}</span></p>
          <p className="text-gray-600">Salary: <span className="font-semibold">{player.salary.toLocaleString()}₽/month</span></p>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-600">Portfolio items: <span className="font-semibold">{portfolio.length}</span></p>
          <p className="text-gray-600">Skills:</p>
          <ul className="list-disc list-inside text-sm text-gray-500">
            <li>Programming: {player.skills.programming}</li>
            <li>Finance: {player.skills.finance}</li>
            <li>Luck: {player.skills.luck}</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={advanceYear}
        >
          Advance Year
        </button>
        
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          onClick={() => buyAsset('apple-stock', 10)}
        >
          Buy Apple Stock (10 shares)
        </button>
        
        <button 
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          onClick={() => addMoney(100000)}
        >
          +100,000 to Balance
        </button>
        
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Store is working! Try clicking buttons to see state changes.
          Data persists in localStorage.
        </p>
      </div>
    </div>
  )
}