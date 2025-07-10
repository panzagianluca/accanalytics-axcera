"use client"

import { useState, useMemo } from "react"
import type { DataItem } from "../types"

interface UsePaginationProps {
  data: DataItem[]
  pageSize?: number
}

export function usePagination({ data, pageSize = 10 }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(data.length / pageSize)
  const totalItems = data.length
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, pageSize])
  
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)
  
  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  
  const loadMore = () => {
    if (hasNextPage) {
      goToNextPage()
    }
  }
  
  // Reset to first page when data changes (e.g., when filters are applied)
  const resetPagination = () => {
    setCurrentPage(1)
  }
  
  return {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    hasNextPage,
    hasPreviousPage,
    startItem,
    endItem,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    loadMore,
    resetPagination,
  }
}
