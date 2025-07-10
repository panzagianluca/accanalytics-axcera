import { useState, useEffect, useCallback } from 'react'
import { DataItem } from '@/types'

export interface LiveDataUpdate {
  id: string
  field: 'equity' | 'growth' | 'pnl'
  value: string
  change: 'increase' | 'decrease' | 'same'
}

export interface LiveDataState {
  updates: Record<string, LiveDataUpdate>
  isConnected: boolean
}

export function useLiveData(data: DataItem[]) {
  const [liveState, setLiveState] = useState<LiveDataState>({
    updates: {},
    isConnected: false
  })

  // Simulate connection status
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setLiveState(prev => ({ ...prev, isConnected: true }))
    }, 1000)

    return () => clearTimeout(connectTimer)
  }, [])

  // Generate random value changes
  const generateRandomUpdate = useCallback((item: DataItem): LiveDataUpdate | null => {
    const fields: Array<'equity' | 'growth' | 'pnl'> = ['equity', 'growth', 'pnl']
    const field = fields[Math.floor(Math.random() * fields.length)]
    
    const currentValue = parseFloat(item[field].replace(/[^-\d.]/g, '')) || 0
    
    // Generate a random change between -5% to +5%
    const changePercent = (Math.random() - 0.5) * 0.1 // -5% to +5%
    const newValue = currentValue * (1 + changePercent)
    
    // Format the new value based on the field type
    let formattedValue: string
    let change: 'increase' | 'decrease' | 'same'
    
    if (newValue > currentValue) {
      change = 'increase'
    } else if (newValue < currentValue) {
      change = 'decrease'
    } else {
      change = 'same'
    }
    
    switch (field) {
      case 'equity':
      case 'pnl':
        formattedValue = newValue >= 0 
          ? `$${newValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` 
          : `-$${Math.abs(newValue).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
        break
      case 'growth':
        formattedValue = `${newValue >= 0 ? '+' : ''}${newValue.toFixed(2)}%`
        break
      default:
        formattedValue = newValue.toFixed(2)
    }
    
    return {
      id: item.id,
      field,
      value: formattedValue,
      change
    }
  }, [])

  // Simulate live updates every 2-5 seconds
  useEffect(() => {
    if (!liveState.isConnected || data.length === 0) return

    const updateInterval = setInterval(() => {
      // Randomly select 3-8 items to update
      const numberOfUpdates = Math.floor(Math.random() * 6) + 3
      const shuffled = [...data].sort(() => 0.5 - Math.random())
      const selectedItems = shuffled.slice(0, numberOfUpdates)
      
      const newUpdates: Record<string, LiveDataUpdate> = {}
      
      selectedItems.forEach(item => {
        const update = generateRandomUpdate(item)
        if (update) {
          const key = `${update.id}-${update.field}`
          newUpdates[key] = update
        }
      })
      
      setLiveState(prev => ({
        ...prev,
        updates: { ...prev.updates, ...newUpdates }
      }))
      
      // Clear the change indicator after 3 seconds
      setTimeout(() => {
        setLiveState(prev => {
          const clearedUpdates = { ...prev.updates }
          Object.keys(newUpdates).forEach(key => {
            if (clearedUpdates[key]) {
              clearedUpdates[key] = { ...clearedUpdates[key], change: 'same' }
            }
          })
          return { ...prev, updates: clearedUpdates }
        })
      }, 3000)
      
    }, Math.random() * 3000 + 2000) // 2-5 seconds

    return () => clearInterval(updateInterval)
  }, [liveState.isConnected, data, generateRandomUpdate])

  // Get live value for a specific item and field
  const getLiveValue = useCallback((itemId: string, field: 'equity' | 'growth' | 'pnl', originalValue: string) => {
    const key = `${itemId}-${field}`
    const update = liveState.updates[key]
    return update ? update.value : originalValue
  }, [liveState.updates])

  // Get change status for a specific item and field
  const getChangeStatus = useCallback((itemId: string, field: 'equity' | 'growth' | 'pnl') => {
    const key = `${itemId}-${field}`
    const update = liveState.updates[key]
    return update ? update.change : 'same'
  }, [liveState.updates])

  return {
    isConnected: liveState.isConnected,
    getLiveValue,
    getChangeStatus
  }
}
