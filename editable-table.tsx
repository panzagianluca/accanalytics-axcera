"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, RotateCcw, Plus, Save } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useColumnManagement } from "./hooks/use-column-management"
import { useFiltering } from "./hooks/use-filtering"
import { mockData, initialColumns } from "./data"
import { ColumnHeader } from "./components/column-header"
import { FilterBanner } from "./components/filter-banner"
import { KPIBanner } from "./components/kpi-banner"
import { LiveStatus } from "./components/live-status"
import { LiveValueCell } from "./components/live-value-cell"
import { useLiveData } from "./hooks/use-live-data"
import { toast } from "sonner" // Import toast from sonner

export default function EditableTable() {
  const {
    visibleColumns,
    allAvailableColumns,
    isEditing,
    toggleEditing,
    reorderColumn,
    removeColumn,
    toggleColumnVisibility,
    setColumnWidth,
    resetColumns,
  } = useColumnManagement()

  const {
    filters,
    filteredData,
    handleFiltersChange,
    handleApplyFilters,
    totalCount,
    filteredCount
  } = useFiltering(mockData)

  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null)
  const [hoveredColumnId, setHoveredColumnId] = useState<string | null>(null)
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)
  
  // Lazy loading states
  const [visibleItemsCount, setVisibleItemsCount] = useState(10)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Live data simulation
  const { isConnected, getLiveValue, getChangeStatus } = useLiveData(filteredData)

  const tableContainerRef = useRef<HTMLDivElement>(null)

  // State for resizing
  const [isResizing, setIsResizing] = useState(false)
  const [resizingColumnId, setResizingColumnId] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!isEditing) return
    setDraggedColumnId(id)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (!isEditing || !draggedColumnId || draggedColumnId === id) return
    setHoveredColumnId(id)
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!isEditing || !draggedColumnId || draggedColumnId === targetId) return
    reorderColumn(draggedColumnId, targetId)
    setDraggedColumnId(null)
    setHoveredColumnId(null)
  }

  const handleDragEnd = () => {
    setDraggedColumnId(null)
    setHoveredColumnId(null)
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, columnId: string) => {
      if (!isEditing) return

      const currentIndex = visibleColumns.findIndex((col) => col.id === columnId)
      if (currentIndex === -1) return

      if (e.key === "ArrowRight") {
        e.preventDefault()
        if (currentIndex < visibleColumns.length - 1) {
          const nextColumn = visibleColumns[currentIndex + 1]
          reorderColumn(columnId, nextColumn.id)
          setSelectedColumnId(columnId)
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        if (currentIndex > 0) {
          const prevColumn = visibleColumns[currentIndex - 1]
          reorderColumn(columnId, prevColumn.id)
          setSelectedColumnId(columnId)
        }
      } else if (e.key === "Delete") {
        e.preventDefault()
        if (visibleColumns[currentIndex]?.isRemovable) {
          removeColumn(columnId)
          const newVisibleColumns = visibleColumns.filter((col) => col.id !== columnId)
          if (newVisibleColumns.length > 0) {
            setSelectedColumnId(newVisibleColumns[Math.min(currentIndex, newVisibleColumns.length - 1)].id)
          } else {
            setSelectedColumnId(null)
          }
        }
      }
    },
    [isEditing, visibleColumns, reorderColumn, removeColumn],
  )

  // Resizing handlers
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, columnId: string, currentWidth: number) => {
      if (!isEditing) return
      setIsResizing(true)
      setResizingColumnId(columnId)
      setStartX(e.clientX)
      setStartWidth(currentWidth)
    },
    [isEditing],
  )

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing && resizingColumnId) {
        const deltaX = e.clientX - startX
        const newWidth = startWidth + deltaX
        setColumnWidth(resizingColumnId, newWidth)
      }
    },
    [isResizing, resizingColumnId, startX, startWidth, setColumnWidth],
  )

  const handleGlobalMouseUp = useCallback(() => {
    setIsResizing(false)
    setResizingColumnId(null)
  }, [])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleGlobalMouseMove)
      window.addEventListener("mouseup", handleGlobalMouseUp)
    } else {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isResizing, handleGlobalMouseMove, handleGlobalMouseUp])

  useEffect(() => {
    if (isEditing && visibleColumns.length > 0 && !selectedColumnId) {
      setSelectedColumnId(visibleColumns[0].id)
    } else if (!isEditing) {
      setSelectedColumnId(null)
    }
  }, [isEditing, visibleColumns, selectedColumnId])

  // Horizontal scroll with mouse wheel
  const handleWheelScroll = useCallback((e: WheelEvent) => {
    if (tableContainerRef.current) {
      e.preventDefault()
      tableContainerRef.current.scrollLeft += e.deltaY
    }
  }, [])

  useEffect(() => {
    const container = tableContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheelScroll, { passive: false })
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheelScroll)
      }
    }
  }, [handleWheelScroll])

  useEffect(() => {
    console.log(
      "EditableTable: visibleColumns updated:",
      visibleColumns.map((c) => c.id),
    )
  }, [visibleColumns])

  // Handle save confirmation toast
  const handleToggleEditing = () => {
    if (isEditing) {
      toast.success("Changes saved!", { duration: 3000 })
    }
    toggleEditing()
  }

  // Lazy loading computed values
  const lazyLoadedData = filteredData.slice(0, visibleItemsCount)
  const hasMoreItems = visibleItemsCount < filteredData.length

  // Reset lazy loading when filters change
  useEffect(() => {
    setVisibleItemsCount(10)
  }, [filteredCount])

  const loadMoreItems = useCallback(() => {
    setVisibleItemsCount(prev => Math.min(prev + 10, filteredData.length))
  }, [filteredData.length])

  // Infinite scroll implementation
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current
    if (!loadMoreElement || !hasMoreItems) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log('Intersection detected, loading more items...') // Debug log
          loadMoreItems()
        }
      },
      { threshold: 0.1, rootMargin: '200px' } // Increased rootMargin for earlier triggering
    )

    observer.observe(loadMoreElement)

    return () => {
      observer.disconnect()
    }
  }, [hasMoreItems, loadMoreItems])

  return (      <Card className="w-full max-w-full shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6 bg-white border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl font-semibold text-gray-800">Customers</CardTitle>
              <LiveStatus isConnected={isConnected} />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredCount} of {totalCount} Customers
            </p>
          </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 h-8 px-3 bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
                    aria-label="Add new column"
                  >
                    <Plus className="h-4 w-4" />
                    Add Column
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-80 p-3 shadow-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    {allAvailableColumns
                    .sort((a, b) => {
                      const aIndex = initialColumns.findIndex((col) => col.id === a.id)
                      const bIndex = initialColumns.findIndex((col) => col.id === b.id)

                      if (aIndex !== -1 && bIndex !== -1) {
                        return aIndex - bIndex
                      }
                      if (aIndex !== -1) return -1
                      if (bIndex !== -1) return 1

                      return a.header.localeCompare(b.header)
                    })
                    .map((col) => {
                      const isColumnVisible = visibleColumns.some((vc) => vc.id === col.id)
                      return (
                        <DropdownMenuItem key={col.id} onSelect={(e) => e.preventDefault()}>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`checkbox-${col.id}`}
                              checked={isColumnVisible}
                              onCheckedChange={() => toggleColumnVisibility(col.id)}
                            />
                            <label
                              htmlFor={`checkbox-${col.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {col.header}
                            </label>
                          </div>
                        </DropdownMenuItem>
                      )
                    })}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={resetColumns}
                className="flex items-center gap-2 h-8 px-3 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                aria-label="Reset to Default View"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </>
          )}
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={handleToggleEditing}
            className={`flex items-center gap-2 h-8 px-4 ${
              isEditing 
                ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600" 
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }`}
            aria-pressed={isEditing}
            aria-label={isEditing ? "Save changes" : "Edit Columns"}
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {isEditing ? "Save" : "Edit Columns"}
          </Button>
        </div>
      </CardHeader>
      
      {/* Filter Banner - Inside card with proper sticky positioning */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 pb-4 pt-4 shadow-sm">
        <FilterBanner
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
        />
      </div>
      
      {/* KPI Banner */}
      <KPIBanner data={filteredData} />
      
      <CardContent ref={tableContainerRef} className="p-0">
        <Table className="border-collapse">
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow className="hover:bg-gray-50">
              {visibleColumns.map((column) => (
                <ColumnHeader
                  key={column.id}
                  column={column}
                  isEditing={isEditing}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  onRemove={removeColumn}
                  isDragging={!!draggedColumnId}
                  draggedColumnId={draggedColumnId}
                  setHoveredColumnId={setHoveredColumnId}
                  hoveredColumnId={hoveredColumnId}
                  onKeyDown={handleKeyDown}
                  isSelected={selectedColumnId === column.id}
                  onResizeMouseDown={handleResizeMouseDown}
                />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lazyLoadedData.map((row) => (
              <TableRow key={row.id} data-account-id={row.id} className="hover:bg-gray-50 border-b border-gray-100">
                {visibleColumns.map((column) => {
                  const isLiveColumn = ['equity', 'growth', 'pnl'].includes(column.accessor as string)
                  const originalValue = row[column.accessor as keyof typeof row] as string
                  
                  if (isLiveColumn) {
                    const liveValue = getLiveValue(row.id, column.accessor as 'equity' | 'growth' | 'pnl', originalValue)
                    const changeStatus = getChangeStatus(row.id, column.accessor as 'equity' | 'growth' | 'pnl')
                    
                    return (
                      <TableCell
                        key={`${row.id}-${column.id}`}
                        className="px-4 py-3 text-sm border-r border-gray-100 last:border-r-0"
                        style={{ width: column.width ? `${column.width}px` : "auto", minWidth: "75px" }}
                      >
                        <LiveValueCell value={liveValue} change={changeStatus} />
                      </TableCell>
                    )
                  }
                  
                  return (
                    <TableCell
                      key={`${row.id}-${column.id}`}
                      className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100 last:border-r-0"
                      style={{ width: column.width ? `${column.width}px` : "auto", minWidth: "75px" }}
                    >
                      {originalValue}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Intersection observer trigger for infinite scroll */}
        {hasMoreItems && (
          <div ref={loadMoreRef} className="h-20 w-full flex items-center justify-center py-4">
            <div className="text-sm text-gray-500">Loading more rows...</div>
          </div>
        )}
        {!hasMoreItems && filteredData.length > 10 && (
          <div className="py-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
            Showing all {filteredData.length} results
          </div>
        )}
      </CardContent>
    </Card>
  )
}
