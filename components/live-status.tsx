import React from 'react'

interface LiveStatusProps {
  isConnected: boolean
  className?: string
}

export function LiveStatus({ isConnected, className = '' }: LiveStatusProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'} ${isConnected ? 'animate-pulse' : ''}`} />
      <span className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
        {isConnected ? 'Live' : 'Connecting...'}
      </span>
    </div>
  )
}
