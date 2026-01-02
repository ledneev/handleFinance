import React from 'react'
import { useGameStore } from '@/store'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { 
  Briefcase, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Zap, 
  BookOpen,
  ChevronRight
} from 'lucide-react'
import { formatCurrency } from '@/utils'
import { CAREER_LEVELS, CAREER_CONFIGS } from '@/constants/careers'

export const CareerPage: React.FC = () => {
  const { player, upgradeCareer, balance } = useGameStore()
  const { career, skills } = player
  
  const currentLevelIndex = CAREER_LEVELS.indexOf(career)
  const currentConfig = CAREER_CONFIGS[career]
  const nextLevel = CAREER_LEVELS[currentLevelIndex + 1]
  const nextConfig = nextLevel ? CAREER_CONFIGS[nextLevel] : null
  
  const canUpgrade = nextConfig && 
    balance >= nextConfig.upgradeCost && 
    skills.programming >= nextConfig.skillRequirement

  const careerProgress = CAREER_LEVELS.map((level, index) => ({
    level,
    config: CAREER_CONFIGS[level],
    isCurrent: level === career,
    isPast: index < currentLevelIndex,
    isFuture: index > currentLevelIndex
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          💼 Развитие карьеры
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Повышайте квалификацию, увеличивайте зарплату и открывайте новые возможности
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Текущая должность</div>
                <div className="text-xl font-bold capitalize">{career}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {currentConfig.description}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Зарплата</div>
                <div className="text-2xl font-bold">{formatCurrency(player.salary)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  в месяц
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {nextConfig && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Следующий уровень</div>
                  <div className="text-xl font-bold capitalize">{nextLevel}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    +{formatCurrency(nextConfig.baseSalary - player.salary)}/мес
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🎯 Карьерная лестница</CardTitle>
          <CardDescription>
            Пройдите путь от стажёра до директора по разработке
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {careerProgress.map((item, index) => (
              <div key={item.level} className="flex items-center">
                {/* Номер этапа */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  ${item.isCurrent 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 border-2 border-blue-500' 
                    : item.isPast 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                  }
                `}>
                  {index + 1}
                </div>

                {index < careerProgress.length - 1 && (
                  <div className={`
                    flex-shrink-0 w-8 h-0.5 mx-2
                    ${item.isPast 
                      ? 'bg-green-500 dark:bg-green-600' 
                      : 'bg-gray-300 dark:bg-gray-700'
                    }
                  `} />
                )}

                <div className={`
                  flex-1 p-4 rounded-lg ml-2
                  ${item.isCurrent 
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-800/50'
                  }
                `}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold capitalize">{item.level}</h3>
                        {item.isCurrent && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full">
                            Текущий
                          </span>
                        )}
                        {item.isPast && (
                          <Award className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.config.description}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatCurrency(item.config.baseSalary)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">в месяц</div>
                    </div>
                  </div>

                  {item.isCurrent && nextConfig && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Требуется: {nextConfig.skillRequirement} очков программирования
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Стоимость повышения: {formatCurrency(nextConfig.upgradeCost)}
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          onClick={upgradeCareer}
                          disabled={!canUpgrade}
                          variant={canUpgrade ? "primary" : "secondary"}
                          icon={<ChevronRight className="h-4 w-4" />}
                        >
                          {canUpgrade ? "Повысить квалификацию" : "Недостаточно средств/навыков"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>⚡ Навыки</CardTitle>
          <CardDescription>
            Развивайте навыки для продвижения по карьерной лестнице
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Программирование</h4>
                  <div className="text-2xl font-bold">{skills.programming}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skills.programming}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Основной навык для карьерного роста. Увеличивается при обучении и работе.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Финансы</h4>
                  <div className="text-2xl font-bold">{skills.finance}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skills.finance}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Влияет на доходность инвестиций. Увеличивается при изучении финансов.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Удача</h4>
                  <div className="text-2xl font-bold">{skills.luck}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skills.luck}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Влияет на случайные события. Может увеличиваться при определенных событиях.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💡 Советы по развитию карьеры</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <span className="font-medium">Инвестируйте в образование</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Покупайте курсы по программированию, чтобы повысить навыки и продвинуться по карьерной лестнице.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="p-1 bg-green-100 dark:bg-green-900 rounded">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <span className="font-medium">Экономьте на повышение</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Откладывайте часть зарплаты для оплаты курсов повышения квалификации.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="p-1 bg-yellow-100 dark:bg-yellow-900 rounded">
                <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <span className="font-medium">Балансируйте развитие</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Развивайте не только программирование, но и финансовую грамотность для лучших инвестиционных решений.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}