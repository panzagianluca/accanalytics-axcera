"use client"

import { useState, useEffect, useCallback } from "react"
import type { Column, DataItem } from "../types"
import { initialColumns, allAvailableColumns } from "../data"

const LOCAL_STORAGE_KEY = "table_column_layout"
const MIN_COLUMN_WIDTH = 75 // Minimum width for a column

export function useColumnManagement() {
  const [columns, setColumns] = useState<Column<DataItem>[]>([])
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const savedLayout = localStorage.getItem(LOCAL_STORAGE_KEY)
    let loadedColumns: Column<DataItem>[]

    if (savedLayout) {
      try {
        const parsedLayout: { id: string; isVisible: boolean; width?: number }[] = JSON.parse(savedLayout)
        // Merge saved layout with current available columns to handle new/removed columns
        const mergedColumns = parsedLayout
          .map((savedCol) => {
            const availableCol = allAvailableColumns.find((col) => col.id === savedCol.id)
            return availableCol
              ? { ...availableCol, isVisible: savedCol.isVisible, width: savedCol.width || availableCol.width }
              : null
          })
          .filter(Boolean) as Column<DataItem>[]

        // Add any new columns that are in allAvailableColumns but not in savedLayout
        // and are initially visible in allAvailableColumns (if any were added later)
        const newColumns = allAvailableColumns.filter(
          (col) => !mergedColumns.some((mc) => mc.id === col.id) && col.isVisible,
        )

        loadedColumns = [...mergedColumns, ...newColumns]
      } catch (e) {
        console.error("Failed to parse saved column layout from localStorage", e)
        loadedColumns = initialColumns
      }
    } else {
      loadedColumns = initialColumns
    }
    setColumns(loadedColumns)
    console.log(
      "useColumnManagement: Columns after load:",
      loadedColumns.map((c) => c.id + ":" + c.isVisible),
    )
  }, [])

  useEffect(() => {
    if (columns.length > 0) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(columns.map((col) => ({ id: col.id, isVisible: col.isVisible, width: col.width }))),
      )
    }
  }, [columns])

  const reorderColumn = useCallback((draggedId: string, targetId: string) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns]
      const draggedIndex = newColumns.findIndex((col) => col.id === draggedId)
      const targetIndex = newColumns.findIndex((col) => col.id === targetId)

      if (draggedIndex === -1 || targetIndex === -1) return prevColumns

      const [draggedColumn] = newColumns.splice(draggedIndex, 1)
      newColumns.splice(targetIndex, 0, draggedColumn)
      console.log(
        "reorderColumn: New columns order:",
        newColumns.map((c) => c.id),
      )
      return newColumns
    })
  }, [])

  const removeColumn = useCallback((columnId: string) => {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((col) => (col.id === columnId ? { ...col, isVisible: false } : col))
      console.log(
        "removeColumn: Columns after removal:",
        updatedColumns.map((c) => c.id + ":" + c.isVisible),
      )
      return updatedColumns
    })
  }, [])

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumns((prevColumns) => {
      const existingColumnIndex = prevColumns.findIndex((col) => col.id === columnId)
      let updatedColumns: Column<DataItem>[]

      if (existingColumnIndex !== -1) {
        // Column exists, toggle its visibility
        updatedColumns = [...prevColumns]
        updatedColumns[existingColumnIndex] = {
          ...updatedColumns[existingColumnIndex],
          isVisible: !updatedColumns[existingColumnIndex].isVisible,
        }
      } else {
        // Column does not exist in current managed columns, add it as visible
        const newColumn = allAvailableColumns.find((col) => col.id === columnId)
        if (newColumn) {
          updatedColumns = [...prevColumns, { ...newColumn, isVisible: true }]
        } else {
          updatedColumns = prevColumns // No change if column not found
        }
      }
      console.log(
        "toggleColumnVisibility: Columns after toggle:",
        updatedColumns.map((c) => c.id + ":" + c.isVisible),
      )
      return updatedColumns
    })
  }, [])

  const setColumnWidth = useCallback((columnId: string, newWidth: number) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => (col.id === columnId ? { ...col, width: Math.max(newWidth, MIN_COLUMN_WIDTH) } : col)),
    )
  }, [])

  const resetColumns = useCallback(() => {
    setColumns(initialColumns)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    console.log(
      "resetColumns: Columns reset to initial:",
      initialColumns.map((c) => c.id),
    )
  }, [])

  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => {
      console.log("toggleEditing called. isEditing will change from", prev, "to", !prev)
      console.log(
        "Current columns state (should not change on toggleEditing):",
        columns.map((c) => c.id + ":" + c.isVisible),
      )
      return !prev
    })
  }, [columns]) // Added columns to dependency array for accurate logging

  const visibleColumns = columns.filter((col) => col.isVisible)

  return {
    visibleColumns,
    allAvailableColumns, // Expose allAvailableColumns for the dropdown
    isEditing,
    toggleEditing,
    reorderColumn,
    removeColumn,
    toggleColumnVisibility, // New function
    setColumnWidth, // Expose setColumnWidth
    resetColumns,
  }
}
