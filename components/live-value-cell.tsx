import React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface LiveValueCellProps {
  value: string
  change: 'increase' | 'decrease' | 'same'
  className?: string
}

export function LiveValueCell({ value, change, className = '' }: LiveValueCellProps) {
  const getChangeColor = () => {
    switch (change) {
      case 'increase':
        return 'text-green-600 bg-green-50'
      case 'decrease':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-slate-700'
    }
  }

  const getTransition = () => {
    return change !== 'same' ? 'transition-all duration-500 ease-in-out' : 'transition-all duration-300'
  }

  const getIcon = () => {
    switch (change) {
      case 'increase':
        return <ChevronUp className="h-3 w-3 inline ml-1" />
      case 'decrease':
        return <ChevronDown className="h-3 w-3 inline ml-1" />
      default:
        return null
    }
  }

  return (
    <div className={`${getChangeColor()} ${getTransition()} ${className} px-2 py-1 rounded inline-flex items-center`}>
      {value}
      {getIcon()}
    </div>
  )
}
