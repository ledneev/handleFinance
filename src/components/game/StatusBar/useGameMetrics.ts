import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';

import { CAREER_LEVELS, CAREER_CONFIGS } from '@/constants/careers';

/**
 * Вычисляет прогресс до следующего уровня карьеры
 */
const calculateCareerProgress = (currentCareer: string, programmingSkill: number) => {
  const career = currentCareer as 'intern' | 'junior' | 'middle' | 'senior' | 'lead' | 'director';
  const currentLevelIndex = CAREER_LEVELS.indexOf(career);

  if (currentLevelIndex === -1) {
    return { progress: 0, label: 'Неизвестно' };
  }

  if (currentLevelIndex >= CAREER_LEVELS.length - 1) {
    return { progress: 100, label: 'Макс. уровень' };
  }

  const nextLevel = CAREER_LEVELS[currentLevelIndex + 1];
  const nextConfig = CAREER_CONFIGS[nextLevel];
  const required = nextConfig.skillRequirement;

  const progress = Math.min(100, (programmingSkill / required) * 100);

  return {
    progress,
    label: `До ${nextLevel}` // можно добавить (${programmingSkill}/${required}), но для адаптива лучше короче
  };
};

export const useGameMetrics = () => {
  const { currentYear, balance, player, portfolio, availableAssets } = useGameStore();

  const portfolioValue = useMemo(() => {
    return portfolio.reduce((total, item) => {
      const asset = availableAssets.find(a => a.id === item.assetId);
      return total + (asset ? asset.currentPrice * item.quantity : 0);
    }, 0);
  }, [portfolio, availableAssets]);

  const netWorth = balance + portfolioValue;

  const skillProgress = useMemo(() => {
    return calculateCareerProgress(player.career, player.skills.programming);
  }, [player.career, player.skills.programming]);

  return {
    currentYear,
    balance,
    netWorth,
    portfolioValue,
    salary: player.salary,
    career: player.career,
    skillProgress,
    advanceYear: useGameStore.getState().advanceYear,
  };
};
