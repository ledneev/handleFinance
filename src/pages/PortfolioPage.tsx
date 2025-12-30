import React from 'react'
import { useGameStore } from '@/store'
import { getAssetById } from '@/constants/assets'
import { formatCurrency } from '@/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { PortfolioItem } from '@/types/game.types'
import type { Asset } from '@/types/game.types'

export const PortfolioPage: React.FC = () => {
  const { portfolio, availableAssets, balance } = useGameStore()
  
  // Определяем тип для элемента портфеля с дополнительными полями
  interface PortfolioItemWithDetails extends PortfolioItem {
    asset: Asset
    currentValue: number
    purchaseValue: number
    profit: number
    profitPercent: number
  }
  
  // Явно указываем тип для portfolioItems
  const portfolioItems: PortfolioItemWithDetails[] = portfolio.map(item => {
    const asset = availableAssets.find(a => a.id === item.assetId) || getAssetById(item.assetId)
    if (!asset) return null
    
    const currentValue = asset.currentPrice * item.quantity
    const purchaseValue = item.purchasePrice * item.quantity
    const profit = currentValue - purchaseValue
    const profitPercent = purchaseValue > 0 ? (profit / purchaseValue) * 100 : 0
    
    return {
      ...item,
      asset,
      currentValue,
      purchaseValue,
      profit,
      profitPercent
    }
  }).filter((item): item is PortfolioItemWithDetails => item !== null)
  
  const totalValue = portfolioItems.reduce((sum, item) => sum + item.currentValue, 0)
  const totalProfit = portfolioItems.reduce((sum, item) => sum + item.profit, 0)
  const netWorth = balance + totalValue
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">💼 Мой портфель</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Обзор ваших инвестиций и их доходности
        </p>
      </div>
      
      {/* Сводка портфеля */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">Общая стоимость</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(totalValue)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {portfolioItems.length} актив{portfolioItems.length === 1 ? '' : portfolioItems.length > 4 ? 'ов' : 'а'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">Общая прибыль</div>
            <div className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfit)}
            </div>
            <div className={`text-sm mt-2 ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalProfit >= 0 ? '📈' : '📉'} {totalProfit >= 0 ? 'Доход' : 'Убыток'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">Чистый капитал</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(netWorth)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Баланс + активы
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Таблица активов */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Детали портфеля</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolioItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Портфель пуст
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Начните инвестировать в активы на странице "Инвестиции"
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Актив</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Количество</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Текущая цена</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Стоимость</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Прибыль</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioItems.map((item) => (
                    <tr 
                      key={item.assetId}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium">{item.asset.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Куплено: {new Date(item.purchaseDate).toLocaleDateString('ru-RU')}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{item.quantity}</td>
                      <td className="py-3 px-4">{formatCurrency(item.asset.currentPrice)}</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(item.currentValue)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {item.profit > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : item.profit < 0 ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <Minus className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={item.profit > 0 ? 'text-green-600' : item.profit < 0 ? 'text-red-600' : 'text-gray-600'}>
                            {formatCurrency(item.profit)}
                          </span>
                          <span className={`text-sm ${item.profit > 0 ? 'text-green-500' : item.profit < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            ({item.profitPercent.toFixed(1)}%)
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}