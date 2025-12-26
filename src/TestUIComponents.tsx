import React from 'react'
import { useState } from 'react'
import { 
  Button,
  Card, CardHeader, CardTitle, CardDescription, CardContent, 
  Modal,
  ConfirmModal,
  NotificationsContainer,
  type NotificationType
} from '@/components/ui'
import { Bell, TrendingUp, DollarSign, Briefcase } from 'lucide-react'

export function TestUIComponents() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: NotificationType
    title: string
    message: string
  }>>([])

  const addNotification = (type: NotificationType) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
      message: `This is a ${type} notification message.`
    }
    setNotifications(prev => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">UI Components Test</h2>

      <NotificationsContainer
        notifications={notifications}
        onClose={removeNotification}
        position="top-right"
      />

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Different button variants and sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button icon={<Bell className="h-4 w-4" />}>With Icon</Button>
            <Button icon={<Bell className="h-4 w-4" />} iconPosition="right">
              Icon Right
            </Button>
            <Button isLoading>Loading</Button>
            <Button fullWidth>Full Width</Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="default" hoverable>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold">Баланс</h4>
                <p className="text-2xl font-bold">500,000 ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="gradient" hoverable>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold">Портфель</h4>
                <p className="text-2xl font-bold">+15.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="outline">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold">Карьера</h4>
                <p className="text-lg font-bold">Middle Developer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals Section */}
      <Card>
        <CardHeader>
          <CardTitle>Modals</CardTitle>
          <CardDescription>Test modal and confirm modal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={() => setIsModalOpen(true)}>
              Open Regular Modal
            </Button>
            
            <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
              Open Confirm Modal
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button variant="success" onClick={() => addNotification('success')}>
              Show Success
            </Button>
            <Button variant="warning" onClick={() => addNotification('warning')}>
              Show Warning
            </Button>
            <Button variant="danger" onClick={() => addNotification('error')}>
              Show Error
            </Button>
            <Button variant="primary" onClick={() => addNotification('info')}>
              Show Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Regular Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This is an example of a regular modal. You can put any content here.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        message="Are you sure you want to perform this action? This action cannot be undone."
        onConfirm={() => {
          console.log('Confirmed!')
          addNotification('success')
        }}
        onCancel={() => {
          console.log('Cancelled!')
          addNotification('info')
        }}
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}