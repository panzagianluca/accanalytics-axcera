"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Search, 
  X, 
  Filter, 
  Save, 
  BookmarkPlus, 
  Share2, 
  Calendar as CalendarIcon,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"

export interface FilterState {
  platforms: string[]
  status: string
  categories: string[]
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  search: string
}

export interface SavedFilter {
  id: string
  name: string
  filters: FilterState
  visibility: 'private' | 'support' | 'risk' | 'admin' | 'everyone'
  createdAt: Date
  createdBy: string
}

interface FilterBannerProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onApplyFilters: (filters: FilterState) => void
}

const PLATFORM_OPTIONS = [
  "MetaTrader 4",
  "MetaTrader 5", 
  "cTrader",
  "DXTrade",
  "TradingView"
]

const STATUS_OPTIONS = [
  "Active",
  "Inactive", 
  "Pending",
  "Suspended",
  "Closed"
]

const CATEGORY_OPTIONS = [
  "Retail",
  "Institutional",
  "VIP",
  "Demo",
  "Live"
]

const VISIBILITY_OPTIONS = [
  { value: 'private', label: 'Private (Only me)', icon: '🔒' },
  { value: 'support', label: 'Support Team', icon: '👥' },
  { value: 'risk', label: 'Risk Team', icon: '⚠️' },
  { value: 'admin', label: 'Admin Team', icon: '👑' },
  { value: 'everyone', label: 'Everyone', icon: '🌍' }
]

const STORAGE_KEY = 'saved_filters'

export function FilterBanner({ filters, onFiltersChange, onApplyFilters }: FilterBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [filterName, setFilterName] = useState("")
  const [selectedVisibility, setSelectedVisibility] = useState<SavedFilter['visibility']>('private')

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSavedFilters(parsed.map((f: any) => ({
          ...f,
          createdAt: new Date(f.createdAt),
          filters: {
            ...f.filters,
            dateRange: {
              from: f.filters.dateRange.from ? new Date(f.filters.dateRange.from) : undefined,
              to: f.filters.dateRange.to ? new Date(f.filters.dateRange.to) : undefined
            }
          }
        })))
      } catch (e) {
        console.error('Failed to load saved filters:', e)
      }
    }
  }, [])

  // Save filters to localStorage
  const saveFiltersToStorage = (filters: SavedFilter[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
    setSavedFilters(filters)
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    onFiltersChange(newFilters)
    onApplyFilters(newFilters)
  }

  const removeFilterChip = (type: string, value?: string) => {
    let newFilters = { ...filters }
    
    switch (type) {
      case 'platform':
        newFilters.platforms = filters.platforms.filter(p => p !== value)
        break
      case 'status':
        newFilters.status = ''
        break
      case 'category':
        newFilters.categories = filters.categories.filter(c => c !== value)
        break
      case 'dateRange':
        newFilters.dateRange = { from: undefined, to: undefined }
        break
      case 'search':
        newFilters.search = ''
        break
    }
    
    onFiltersChange(newFilters)
    onApplyFilters(newFilters)
  }

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      platforms: [],
      status: '',
      categories: [],
      dateRange: { from: undefined, to: undefined },
      search: ''
    }
    onFiltersChange(emptyFilters)
    onApplyFilters(emptyFilters)
  }

  const hasActiveFilters = () => {
    return filters.platforms.length > 0 || 
           filters.status !== '' || 
           filters.categories.length > 0 || 
           filters.dateRange.from || 
           filters.dateRange.to || 
           filters.search !== ''
  }

  const saveCurrentFilters = () => {
    if (!filterName.trim()) {
      toast.error("Please enter a filter name")
      return
    }

    if (!hasActiveFilters()) {
      toast.error("No filters to save")
      return
    }

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName.trim(),
      filters: { ...filters },
      visibility: selectedVisibility,
      createdAt: new Date(),
      createdBy: 'Current User' // In real app, this would be the actual user
    }

    const updatedFilters = [...savedFilters, newFilter]
    saveFiltersToStorage(updatedFilters)
    
    setFilterName("")
    setSelectedVisibility('private')
    setSaveDialogOpen(false)
    
    toast.success(`Filter "${newFilter.name}" saved successfully!`)
  }

  const loadSavedFilter = (savedFilter: SavedFilter) => {
    onFiltersChange(savedFilter.filters)
    onApplyFilters(savedFilter.filters)
    toast.success(`Loaded filter: ${savedFilter.name}`)
  }

  const deleteSavedFilter = (filterId: string) => {
    const updatedFilters = savedFilters.filter(f => f.id !== filterId)
    saveFiltersToStorage(updatedFilters)
    toast.success("Filter deleted")
  }

  const getActiveChips = () => {
    const chips = []
    
    // Platform chips
    filters.platforms.forEach(platform => {
      chips.push({
        type: 'platform',
        label: `Platform: ${platform}`,
        value: platform,
        color: 'bg-blue-100 text-blue-800'
      })
    })
    
    // Status chip
    if (filters.status) {
      chips.push({
        type: 'status',
        label: `Status: ${filters.status}`,
        value: filters.status,
        color: 'bg-green-100 text-green-800'
      })
    }
    
    // Category chips
    filters.categories.forEach(category => {
      chips.push({
        type: 'category',
        label: `Category: ${category}`,
        value: category,
        color: 'bg-purple-100 text-purple-800'
      })
    })
    
    // Date range chip
    if (filters.dateRange.from || filters.dateRange.to) {
      const fromStr = filters.dateRange.from ? format(filters.dateRange.from, 'MMM dd') : 'Start'
      const toStr = filters.dateRange.to ? format(filters.dateRange.to, 'MMM dd') : 'End'
      chips.push({
        type: 'dateRange',
        label: `Date: ${fromStr} - ${toStr}`,
        color: 'bg-orange-100 text-orange-800'
      })
    }
    
    // Search chip
    if (filters.search) {
      chips.push({
        type: 'search',
        label: `Search: "${filters.search}"`,
        color: 'bg-gray-100 text-gray-800'
      })
    }
    
    return chips
  }

  return (
    <div className="w-full">
      {/* Detailed Filter Card - Always Visible */}
      <Card className="px-6 py-4 border border-gray-200 shadow-sm bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Advanced Search"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 h-8 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Platform Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[140px] h-8 justify-between bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                Platforms ({filters.platforms.length})
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 shadow-lg border-gray-200">
              <DropdownMenuLabel className="text-gray-700 font-medium">Select Platforms</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              {PLATFORM_OPTIONS.map((platform) => (
                <DropdownMenuItem key={platform} onSelect={(e) => e.preventDefault()}>
                  <div className="flex items-center space-x-2 w-full">
                    <Checkbox
                      checked={filters.platforms.includes(platform)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter('platforms', [...filters.platforms, platform])
                        } else {
                          updateFilter('platforms', filters.platforms.filter(p => p !== platform))
                        }
                      }}
                    />
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {platform}
                    </label>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <div className="relative">
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="min-w-[140px] h-8 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="shadow-lg border-gray-200">
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status} className="hover:bg-blue-50">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filters.status && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                onClick={() => removeFilterChip('status')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[140px] h-8 justify-between bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                Categories ({filters.categories.length})
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 shadow-lg border-gray-200">
              <DropdownMenuLabel className="text-gray-700 font-medium">Select Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {CATEGORY_OPTIONS.map((category) => (
                <DropdownMenuItem key={category} onSelect={(e) => e.preventDefault()}>
                  <div className="flex items-center space-x-2 w-full">
                    <Checkbox
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter('categories', [...filters.categories, category])
                        } else {
                          updateFilter('categories', filters.categories.filter(c => c !== category))
                        }
                      }}
                    />
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {category}
                    </label>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[160px] h-8 justify-start text-left font-normal bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd")} -{" "}
                      {format(filters.dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-lg border-gray-200" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange.from}
                selected={{
                  from: filters.dateRange.from,
                  to: filters.dateRange.to
                }}
                onSelect={(range) => updateFilter('dateRange', range || { from: undefined, to: undefined })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {/* Saved Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Saved Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel className="text-sm font-semibold">Quick Load</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {savedFilters.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No saved filters yet
                  </div>
                ) : (
                  savedFilters.map((savedFilter) => (
                    <DropdownMenuItem
                      key={savedFilter.id}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onSelect={() => loadSavedFilter(savedFilter)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{savedFilter.name}</span>
                        <span className="text-xs">
                          {VISIBILITY_OPTIONS.find(v => v.value === savedFilter.visibility)?.icon}
                        </span>
                      </div>
                      {savedFilter.createdBy === 'Current User' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSavedFilter(savedFilter.id)
                          }}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Save Current Filter */}
            {hasActiveFilters() && (
              <DropdownMenu open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Filter Name</label>
                      <Input
                        placeholder="Enter filter name..."
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Visibility</label>
                      <Select value={selectedVisibility} onValueChange={(value) => setSelectedVisibility(value as SavedFilter['visibility'])}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VISIBILITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.icon} {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSaveDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveCurrentFilters}>
                        Save Filter
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters() && (
          <div className="pt-3 mt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {getActiveChips().map((chip, index) => (
                  <Badge
                    key={`${chip.type}-${chip.value || index}`}
                    variant="secondary"
                    className={cn("flex items-center gap-1 pr-1 h-6 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100", chip.color)}
                  >
                    <span className="text-xs font-medium">{chip.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-blue-200/50 text-blue-600"
                      onClick={() => removeFilterChip(chip.type, chip.value)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              
              {/* Clear All Link */}
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors font-medium"
              >
                <X className="h-3 w-3" />
                Clear All
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}