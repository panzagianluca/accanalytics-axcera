import React from 'react'
import { Check, X } from 'lucide-react'

interface BooleanIconCellProps {
  value: string
  className?: string
}

export function BooleanIconCell({ value, className = '' }: BooleanIconCellProps) {
  const normalizedValue = value.toLowerCase().trim()
  const isTrue = normalizedValue === 'true' || normalizedValue === '1' || normalizedValue === 'yes'
  
  if (isTrue) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Check className="h-4 w-4 text-green-600" />
      </div>
    )
  } else {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <X className="h-4 w-4 text-red-600" />
      </div>
    )
  }
}
