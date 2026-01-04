import React from 'react'
import { useUIStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Bell, X } from 'lucide-react'

export const NotificationsPanel: React.FC = () => {
  const { notifications, clearNotifications, removeNotification } = useUIStore()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления ({notifications.length})
            </CardTitle>
            <button
              onClick={clearNotifications}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Очистить все
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  p-3 rounded-lg border-l-4
                  ${notification.type === 'success' 
                    ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-700' 
                    : notification.type === 'error'
                    ? 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-700'
                    : notification.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-700'
                    : 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-700'
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm mt-1">{notification.message}</div>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}