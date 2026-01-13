import React from 'react'
import { useAchievementStore } from '@/store/achievementStore'

export const AchievementsPage: React.FC = () => {
  const { achievements } = useAchievementStore()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🏆 Достижения</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Твои успехи в игре. Некоторые скрыты — исследуй мир!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(achievements).map(ach => (
          <div
            key={ach.id}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${ach.unlocked
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden="true">
                {ach.unlocked ? ach.icon : '❓'}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {ach.unlocked ? ach.title : '???'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {ach.unlocked ? ach.description : 'Скрытое достижение'}
                </p>
                {ach.unlocked && ach.unlockDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Получено: {new Date(ach.unlockDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}