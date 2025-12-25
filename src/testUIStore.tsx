import { useUI } from '@/hooks/useUI'
import { notify } from '@/store'


export function TestUIStore() {
  const ui = useUI()

  const handleOpenConfirm = () => {
    ui.openConfirmModal({
      title: 'Подтверждение',
      message: 'Вы уверены что хотите выполнить это действие?',
      onConfirm: () => {
        notify.success('Подтверждено', 'Действие выполнено')
        ui.closeModal()
      },
      onCancel: () => {
        notify.info('Отменено', 'Действие отменено')
        ui.closeModal()
      }
    })
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800">UI Store Test</h2>
      
      <div className="space-y-3">
        <p>Тема: {ui.theme}</p>
        <p>Модалка открыта: {ui.modal.isOpen ? 'Да' : 'Нет'}</p>
        <p>Тип модалки: {ui.modal.type || 'Нет'}</p>
        
        <div className="flex gap-2 flex-wrap">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={ui.toggleTheme}
          >
            Переключить тему
          </button>
          
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={() => ui.openModal('info', { title: 'Инфо', message: 'Тестовая инфо модалка' })}
          >
            Открыть модалку (универсально)
          </button>
          
          <button 
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            onClick={handleOpenConfirm}
          >
            Открыть Confirm (хелпер)
          </button>
          
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={ui.closeModal}
          >
            Закрыть модалку
          </button>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={() => notify.success('Успех!', 'Операция выполнена', 2000)}
          >
            Успех (2с)
          </button>
          
          <button 
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            onClick={() => notify.warning('Внимание!', 'Что-то не так', 3000)}
          >
            Предупреждение (3с)
          </button>
          
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => notify.error('Ошибка!', 'Критическая ошибка', 4000)}
          >
            Ошибка (4с)
          </button>
        </div>
        
        <div>
          <p className="font-medium">Уведомления ({ui.notifications.length}):</p>
          {ui.notifications.map(n => (
            <div 
              key={n.id} 
              className={`p-2 mb-2 rounded border-l-4 ${
                n.type === 'success' ? 'bg-green-50 border-green-500' :
                n.type === 'error' ? 'bg-red-50 border-red-500' :
                n.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}
            >
              <strong>{n.title}</strong>: {n.message}
              <button 
                onClick={() => ui.removeNotification(n.id)}
                className="ml-2 text-sm text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={ui.clearNotifications}
        >
          Очистить все уведомления
        </button>
      </div>
    </div>
  )
}