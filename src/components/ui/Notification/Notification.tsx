import React, { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationProps {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
  className?: string
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const colors = {
  success: 'bg-green-50 border-green-500 text-green-900 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300',
  error: 'bg-red-50 border-red-500 text-red-900 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300',
  info: 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
}

export const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)
  
  const Icon = icons[type]
  const colorClass = colors[type]
  
  useEffect(() => {
    if (!duration) return
    
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Даем время на анимацию
    }, duration)
    
    // Анимация прогресс-бара
    const interval = setInterval(() => {
      setProgress(prev => {
        const step = 100 / (duration / 100)
        return Math.max(0, prev - step)
      })
    }, 100)
    
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [duration, id, onClose])
  
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(id), 300)
  }
  
  if (!isVisible) return null
  
  return (
    <div
      className={cn(
        'relative w-full max-w-sm overflow-hidden rounded-lg border-l-4 shadow-lg transition-all duration-300',
        'animate-in slide-in-from-right-5 fade-in',
        colorClass,
        className
      )}
      role="alert"
    >
      {duration > 0 && (
        <div 
          className="absolute top-0 left-0 h-1 bg-current opacity-20 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      )}
      
      <div className="flex p-4">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        
        <div className="ml-3 flex-1">
          <p className="font-medium">{title}</p>
          <p className="mt-1 text-sm opacity-90">{message}</p>
        </div>
        
        <button
          onClick={handleClose}
          className="ml-4 flex-shrink-0 rounded-md opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
          aria-label="Close notification"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

// Компонент для контейнера уведомлений
export interface NotificationsContainerProps {
  notifications: Array<{
    id: string
    type: NotificationType
    title: string
    message: string
  }>
  onClose: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  maxNotifications?: number
}

export const NotificationsContainer: React.FC<NotificationsContainerProps> = ({
  notifications,
  onClose,
  position = 'top-right',
  maxNotifications = 5
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }
  
  const displayedNotifications = notifications.slice(0, maxNotifications)
  
  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-2',
      positionClasses[position]
    )}>
      {displayedNotifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onClose}
        />
      ))}
    </div>
  )
}