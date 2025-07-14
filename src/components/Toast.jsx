import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, X, Info } from 'lucide-react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    const newToast = { id, message, type }
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const toast = {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    info: (message) => addToast(message, 'info')
  }

  return { toasts, toast, removeToast }
}

export function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-80 animate-in slide-in-from-right-full ${
            toast.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : toast.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : toast.type === 'error' ? (
            <XCircle className="w-5 h-5 text-red-600" />
          ) : (
            <Info className="w-5 h-5 text-blue-600" />
          )}
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function Spinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <div className="w-full h-full border-2 border-gray-300 border-t-primary rounded-full"></div>
    </div>
  )
}

