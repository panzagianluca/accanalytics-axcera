"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Column, DataItem } from "../types"

interface ColumnHeaderProps {
  column: Column<DataItem>
  isEditing: boolean
  onDragStart: (e: React.DragEvent, id: string) => void
  onDragOver: (e: React.DragEvent, id: string) => void
  onDrop: (e: React.DragEvent, id: string) => void
  onDragEnd: (e: React.DragEvent) => void
  onRemove: (id: string) => void
  isDragging: boolean
  draggedColumnId: string | null
  setHoveredColumnId: (id: string | null) => void
  hoveredColumnId: string | null
  onKeyDown: (e: React.KeyboardEvent, columnId: string) => void
  isSelected: boolean
  onResizeMouseDown: (e: React.MouseEvent, columnId: string, startWidth: number) => void // New prop for resize
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  isEditing,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onRemove,
  isDragging,
  draggedColumnId,
  setHoveredColumnId,
  hoveredColumnId,
  onKeyDown,
  isSelected,
  onResizeMouseDown, // Destructure new prop
}) => {
  const headerRef = useRef<HTMLTableCellElement>(null)

  useEffect(() => {
    if (isSelected && headerRef.current) {
      headerRef.current.focus()
    }
  }, [isSelected])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (isEditing && column.isDraggable) {
      onDragOver(e, column.id)
      setHoveredColumnId(column.id)
    }
  }

  const handleDragLeave = () => {
    setHoveredColumnId(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, column.id)
    setHoveredColumnId(null)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd(e)
  }

  const isTarget = hoveredColumnId === column.id && draggedColumnId !== column.id

  return (
    <TableHead
      ref={headerRef}
      key={column.id}
      draggable={isEditing && column.isDraggable}
      onDragStart={(e) => onDragStart(e, column.id)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onDragLeave={handleDragLeave}
      onKeyDown={(e) => onKeyDown(e, column.id)}
      tabIndex={isEditing ? 0 : -1}
      style={{ width: column.width ? `${column.width}px` : "auto", minWidth: "90px", height: "60px" }} // Apply width and height
      className={`relative group px-4 py-2 text-center font-medium text-gray-700 dark:text-gray-300 align-middle ${
        isEditing ? "cursor-grab" : ""
      } ${isDragging && draggedColumnId === column.id ? "opacity-50" : ""}
      ${isTarget ? "border-l-2 border-blue-500" : ""}
      ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
      `}
    >
      <div className="flex items-center justify-between gap-2 h-full">
        <span 
          className="text-sm leading-tight overflow-hidden text-ellipsis text-center flex-1"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.2',
            maxHeight: '2.4em'
          }}
        >
          {column.header}
        </span>
        {/* Always render the button, control visibility with classes */}
        <Button
          variant="ghost"
          size="icon"
          className={`h-5 w-5 transition-opacity flex-shrink-0 ${
            isEditing && column.isRemovable
              ? "opacity-0 group-hover:opacity-100 pointer-events-auto" // Visible on hover in edit mode
              : "opacity-0 pointer-events-none" // Always invisible and non-interactive in normal mode
          }`}
          onClick={(e) => {
            e.stopPropagation()
            onRemove(column.id)
          }}
          aria-label={`Remove ${column.header} column`}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      {isEditing && ( // Only render resize handle in edit mode
        <div
          className="absolute top-0 right-0 w-2 h-full cursor-col-resize z-10"
          onMouseDown={(e) => {
            if (headerRef.current) {
              onResizeMouseDown(e, column.id, headerRef.current.offsetWidth)
            }
          }}
          aria-label={`Resize ${column.header} column`}
        />
      )}
    </TableHead>
  )
}
