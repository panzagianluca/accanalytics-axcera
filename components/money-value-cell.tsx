import React from 'react'

interface MoneyValueCellProps {
  value: string
  type: 'growth' | 'pnl' | 'avgLoss' | 'avgWin' | 'default'
  className?: string
}

export function MoneyValueCell({ value, type, className = '' }: MoneyValueCellProps) {
  const getColorClass = () => {
    // Parse the numeric value for all types
    const numericValue = parseFloat(value.replace(/[^-\d.]/g, ''))
    
    if (type === 'avgLoss') {
      // If value is 0, show black, otherwise red
      return numericValue === 0 ? 'text-slate-700' : 'text-red-600'
    }
    
    if (type === 'avgWin') {
      // If value is 0, show black, otherwise green
      return numericValue === 0 ? 'text-slate-700' : 'text-green-600'
    }
    
    if (type === 'growth' || type === 'pnl') {
      // Parse the value to determine if it's positive or negative
      if (numericValue > 0) {
        return 'text-green-600'
      } else if (numericValue < 0) {
        return 'text-red-600'
      }
    }
    
    return 'text-slate-700' // Default color
  }

  return (
    <span className={`font-medium ${getColorClass()} ${className}`}>
      {value}
    </span>
  )
}
