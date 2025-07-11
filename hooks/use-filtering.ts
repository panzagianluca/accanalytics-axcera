"use client"

import { useState, useEffect, useMemo } from "react"
import type { DataItem } from "../types"
import type { FilterState } from "../components/filter-banner"

export function useFiltering(data: DataItem[]) {
  const [filters, setFilters] = useState<FilterState>({
    platforms: [],
    plan: '',
    categories: [],
    countries: [],
    dateRange: { from: undefined, to: undefined },
    search: ''
  })

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('current_filters')
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters)
        setFilters({
          ...parsed,
          dateRange: {
            from: parsed.dateRange.from ? new Date(parsed.dateRange.from) : undefined,
            to: parsed.dateRange.to ? new Date(parsed.dateRange.to) : undefined
          }
        })
      } catch (e) {
        console.error('Failed to load filters from localStorage:', e)
      }
    }
  }, [])

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('current_filters', JSON.stringify(filters))
  }, [filters])

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Platform filter
      if (filters.platforms.length > 0 && !filters.platforms.includes(item.platform)) {
        return false
      }

      // Plan filter (using 'program' field from data)
      if (filters.plan && item.program !== filters.plan) {
        return false
      }

      // Category filter (using 'type' field from data)
      if (filters.categories.length > 0 && !filters.categories.includes(item.type)) {
        return false
      }

      // Country filter
      if (filters.countries.length > 0 && !filters.countries.includes(item.country)) {
        return false
      }

      // Date range filter (using 'firstTradeDate' field from data)
      if (filters.dateRange.from || filters.dateRange.to) {
        const itemDate = new Date(item.firstTradeDate)
        
        if (filters.dateRange.from && itemDate < filters.dateRange.from) {
          return false
        }
        
        if (filters.dateRange.to && itemDate > filters.dateRange.to) {
          return false
        }
      }

      // Search filter (searches across multiple fields)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableFields = [
          item.account,
          item.customer,
          item.name,
          item.email,
          item.orderNr,
          item.program,
          item.platform
        ]
        
        const matchesSearch = searchableFields.some(field => 
          field && field.toLowerCase().includes(searchTerm)
        )
        
        if (!matchesSearch) {
          return false
        }
      }

      return true
    })
  }, [data, filters])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = (newFilters: FilterState) => {
    // This could trigger additional side effects like analytics tracking
    console.log('Filters applied:', newFilters)
  }

  return {
    filters,
    filteredData,
    handleFiltersChange,
    handleApplyFilters,
    totalCount: data.length,
    filteredCount: filteredData.length
  }
}