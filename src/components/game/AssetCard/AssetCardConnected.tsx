import React from 'react'
import { useGameStore } from '@/store'
import { AssetCard, type AssetCardProps } from './AssetCard'
import { getAssetById } from '@/constants/assets'

interface AssetCardConnectedProps extends Omit<AssetCardProps, 'asset' | 'ownedQuantity' | 'onBuy' | 'onSell'> {
  assetId: string
}

export const AssetCardConnected: React.FC<AssetCardConnectedProps> = ({ assetId, ...props }) => {
  const { portfolio, buyAsset, sellAsset, availableAssets } = useGameStore()
  
  const asset = availableAssets.find(a => a.id === assetId) || getAssetById(assetId)
  const portfolioItem = portfolio.find(item => item.assetId === assetId)
  const ownedQuantity = portfolioItem?.quantity || 0
  
  if (!asset) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">Актив не найден: {assetId}</p>
      </div>
    )
  }
  
  const handleBuy = (quantity: number) => {
    buyAsset(assetId, quantity)
  }
  
  const handleSell = (quantity: number) => {
    sellAsset(assetId, quantity)
  }
  
  return (
    <AssetCard
      asset={asset}
      ownedQuantity={ownedQuantity}
      onBuy={handleBuy}
      onSell={handleSell}
      {...props}
    />
  )
}