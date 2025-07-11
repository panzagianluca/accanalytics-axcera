import React from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download, FileSpreadsheet, Table } from 'lucide-react'

interface ExportButtonProps {
  onExportVisible?: () => void
  onExportAll?: () => void
  className?: string
}

export function ExportButton({ onExportVisible, onExportAll, className = '' }: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 h-8 px-3 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 ${className}`}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onExportVisible} className="cursor-pointer">
          <Table className="mr-2 h-4 w-4" />
          Export Visible Columns
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportAll} className="cursor-pointer">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export All Columns
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
