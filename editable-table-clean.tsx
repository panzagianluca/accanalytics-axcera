"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pencil, RotateCcw, Plus, Save, Search, Settings, Filter, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
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
import { toast } from "sonner"

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
  const [showFilters, setShowFilters] = useState(false)
  
  // Lazy loading states
  const [visibleItemsCount, setVisibleItemsCount] = useState(50)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Get visible data slice for lazy loading
  const visibleData = filteredData.slice(0, visibleItemsCount)
  const hasMoreData = visibleItemsCount < filteredData.length

  // Live data simulation
  const { isConnected, getLiveValue, getChangeStatus } = useLiveData(filteredData)

  // Load more data function
  const loadMoreData = useCallback(() => {
    if (isLoadingMore || !hasMoreData) return
    
    setIsLoadingMore(true)
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleItemsCount(prev => Math.min(prev + 50, filteredData.length))
      setIsLoadingMore(false)
    }, 100)
  }, [isLoadingMore, hasMoreData, filteredData.length])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMoreData && !isLoadingMore) {
          loadMoreData()
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasMoreData, isLoadingMore, loadMoreData])

  // Reset visible items when filters change
  useEffect(() => {
    setVisibleItemsCount(50)
  }, [filteredData.length])

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

  // Handle save confirmation toast
  const handleToggleEditing = () => {
    if (isEditing) {
      toast.success("Changes saved!", { duration: 3000 })
    }
    toggleEditing()
  }

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value
  ).length

  return (
    <Card className="w-full max-w-full overflow-auto shadow-lg border-0">
      {/* Premium Header */}
      <CardHeader className="border-b bg-gradient-to-r from-white to-slate-50/50 pb-6">
        <div className="flex items-center justify-between">
          {/* Left: Title & Stats */}
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">
                Customers
              </CardTitle>
              <LiveStatus isConnected={isConnected} />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{filteredCount}</span> of{" "}
                <span className="font-semibold">{totalCount}</span> customers
              </p>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Premium Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                className="pl-10 w-80 h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
                value={filters.search || ""}
                onChange={(e) => handleFiltersChange({ ...filters, search: e.target.value })}
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
                  onClick={() => handleFiltersChange({ ...filters, search: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filters Button */}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="default"
              className="h-11 px-4 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-blue-500 hover:bg-blue-500">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Edit Columns */}
            <Button
              variant={isEditing ? "default" : "outline"}
              size="default"
              className="h-11 px-4 shadow-sm"
              onClick={handleToggleEditing}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isEditing ? "Done" : "Columns"}
            </Button>
          </div>
        </div>

        {/* Edit Mode Controls */}
        {isEditing && (
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm font-medium text-slate-700 mr-2">Customize:</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 shadow-sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Column
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 max-h-80 overflow-y-auto p-2">
                <div className="grid gap-1">
                  {allAvailableColumns.map((col) => {
                    const isVisible = visibleColumns.some((vc) => vc.id === col.id)
                    return (
                      <DropdownMenuItem key={col.id} onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center space-x-3 w-full py-1">
                          <Checkbox
                            checked={isVisible}
                            onCheckedChange={() => toggleColumnVisibility(col.id)}
                          />
                          <span className="text-sm font-medium">{col.header}</span>
                        </div>
                      </DropdownMenuItem>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={resetColumns} className="h-9 shadow-sm">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <div className="text-xs text-slate-500 ml-auto">
              Drag columns to reorder • Press Delete to remove
            </div>
          </div>
        )}
      </CardHeader>

      {/* Collapsible Filter Section */}
      {showFilters && (
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200">
          <FilterBanner
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={handleApplyFilters}
          />
        </div>
      )}

      {/* KPI Banner */}
      <KPIBanner data={filteredData} />

      {/* Table Content */}
      <CardContent ref={tableContainerRef} className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/90 sticky top-0 z-10">
            <TableRow className="border-slate-200 hover:bg-slate-50/90">
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
            {visibleData.map((row, index) => (
              <TableRow 
                key={row.id} 
                data-account-id={row.id}
                className={`border-slate-200 hover:bg-slate-50/70 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                }`}
              >
                {visibleColumns.map((column) => {
                  const isLiveColumn = ['equity', 'growth', 'pnl'].includes(column.accessor as string)
                  const originalValue = row[column.accessor as keyof typeof row] as string
                  
                  if (isLiveColumn) {
                    const liveValue = getLiveValue(row.id, column.accessor as 'equity' | 'growth' | 'pnl', originalValue)
                    const changeStatus = getChangeStatus(row.id, column.accessor as 'equity' | 'growth' | 'pnl')
                    
                    return (
                      <TableCell
                        key={`${row.id}-${column.id}`}
                        style={{ width: column.width ? `${column.width}px` : "auto", minWidth: "120px" }}
                        className="py-4 font-medium"
                      >
                        <LiveValueCell value={liveValue} change={changeStatus} />
                      </TableCell>
                    )
                  }
                  
                  return (
                    <TableCell
                      key={`${row.id}-${column.id}`}
                      style={{ width: column.width ? `${column.width}px` : "auto", minWidth: "120px" }}
                      className="text-slate-700 py-4 font-medium"
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
        {hasMoreData && (
          <div ref={loadMoreRef} className="h-4 w-full" />
        )}
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="text-sm text-slate-500">Loading more rows...</div>
          </div>
        )}
        {!hasMoreData && visibleData.length > 0 && (
          <div className="py-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
            Showing all {filteredData.length} results
          </div>
        )}
      </CardContent>
    </Card>
  )
}
