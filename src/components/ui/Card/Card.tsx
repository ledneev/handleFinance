import React from 'react'
import { cn } from '@/utils/cn'

export type CardVariant = 'default' | 'gradient' | 'outline'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  hoverable?: boolean
  shadow?: boolean
}

const getCardClasses = (
  variant: CardVariant,
  padding: CardPadding,
  hoverable: boolean,
  shadow: boolean,
  className?: string
) => {
  const baseClasses = 'rounded-xl border transition-all duration-200'
  
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-transparent',
    outline: 'bg-transparent border-gray-300 dark:border-gray-600'
  }
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const hoverClass = hoverable ? 'hover:shadow-lg hover:-translate-y-0.5' : ''
  const shadowClass = shadow ? 'shadow-md' : ''
  
  return cn(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClass,
    shadowClass,
    className
  )
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      shadow = true,
      className,
      ...props
    },
    ref
  ) => {
    const cardClasses = getCardClasses(variant, padding, hoverable, shadow, className)
    
    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Дополнительные компоненты карточки
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4', className)} {...props} />
)

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-xl font-semibold text-gray-900 dark:text-gray-100', className)} {...props} />
)

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-gray-600 dark:text-gray-400', className)} {...props} />
)

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('', className)} {...props} />
)

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-4 pt-4 border-t border-gray-200 dark:border-gray-700', className)} {...props} />
)