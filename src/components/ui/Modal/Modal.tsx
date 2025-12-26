import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className
}) => {
  // Блокируем скролл когда модалка открыта
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }
  
  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className={cn(
          'relative w-full transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all',
          sizeClasses[size],
          className
        )}>
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
  
  return createPortal(modalContent, document.body)
}

// Компонент для модалки подтверждения (Confirm Modal)
export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  message: string
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  variant = 'info',
  onClose,
  ...modalProps
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }
  
  const handleCancel = () => {
    onCancel?.()
    onClose()
  }
  
  const variantClasses = {
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    info: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
  }
  
  return (
    <Modal {...modalProps} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {cancelText}
          </button>
          
          <button
            onClick={handleConfirm}
            className={cn(
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
              variantClasses[variant]
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}