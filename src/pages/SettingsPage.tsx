import React from 'react';
import { useGameStore, useUIStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Button } from '@/components/ui';
import { Moon, Sun, Bell, RotateCcw, Trash2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, setTheme, clearNotifications } = useUIStore();
  const { resetGame } = useGameStore();

  const handleResetGame = () => {
    if (window.confirm('Вы уверены? Это удалит весь прогресс и начнет игру заново.')) {
      resetGame();
    }
  };

  const handleClearData = () => {
    if (window.confirm('ВНИМАНИЕ: Это удалит все сохраненные данные. Действие необратимо.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">⚙️ Настройки</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Настройте игру под свои предпочтения
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🎨 Внешний вид</CardTitle>
          <CardDescription>Настройте тему и отображение игры (пока не работает, переключение только через prefer color scheme)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-medium">Тема</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {theme === 'light' ? 'Светлая' : 'Тёмная'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'primary' : 'secondary'}
                size="sm"
                icon={<Sun className="h-4 w-4" />}
                onClick={() => setTheme('light')}
              >
                Светлая
              </Button>
              <Button
                variant={theme === 'dark' ? 'primary' : 'secondary'}
                size="sm"
                icon={<Moon className="h-4 w-4" />}
                onClick={() => setTheme('dark')}
              >
                Тёмная
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-medium">Переключатель темы</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Быстрое переключение между темами
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              onClick={toggleTheme}
            >
              Сменить тему
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔔 Уведомления</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-medium">Очистить все уведомления</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Удалить все показанные уведомления
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Bell className="h-4 w-4" />}
              onClick={clearNotifications}
            >
              Очистить
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎮 Управление игрой</CardTitle>
          <CardDescription>Опасные действия - будьте осторожны</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                Начать игру заново
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Сбросить весь прогресс и начать с начала
              </p>
            </div>
            <Button
              variant="warning"
              size="sm"
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={handleResetGame}
            >
              Сбросить
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-300">Очистить все данные</h4>
              <p className="text-sm text-red-700 dark:text-red-400">
                Удалить все сохранения из localStorage
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={handleClearData}
            >
              Очистить
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ℹ️ Информация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Версия игры</h4>
              <p>0.0.1 (альфа)</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Сохранение данных</h4>
              <p>Игра автоматически сохраняется в localStorage вашего браузера.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Сброс настроек</h4>
              <p>Для полного сброса очистите кэш браузера или используйте кнопку выше.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                Правовая информация
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Это <span className="font-medium">обучающая игра</span>, не являющаяся реальным
                  инвестиционным сервисом.
                </li>
                <li>
                  Все активы, рынки и доходы — <span className="font-medium">виртуальные</span> и не
                  связаны с реальностью.
                </li>
                <li>
                  Совпадения с реальными компаниями или событиями —{' '}
                  <span className="font-medium">случайны</span>.
                </li>
                <li>
                  Использование игры означает согласие с её{' '}
                  <span className="font-medium">некоммерческим и образовательным характером</span>.
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-1'>
                Проект является открытым, исходный код и документация доступны на <a className='text-blue-800' href="https://github.com/ledneev/handleFinance" target="_blank" rel="noopener noreferrer">GitHub</a>.
              </h4>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
