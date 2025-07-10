"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import type { DataItem } from "../types"

interface KPIBannerProps {
  data: DataItem[]
}

export const KPIBanner: React.FC<KPIBannerProps> = ({ data }) => {
  // Calculate KPIs
  const calculateKPIs = () => {
    if (!data || data.length === 0) {
      return {
        totalPnL: 0,
        largestProfit: { value: 0, account: "", accountId: "" },
        largestLoss: { value: 0, account: "", accountId: "" }
      }
    }

    let totalPnL = 0
    let largestProfit = { value: -Infinity, account: "", accountId: "" }
    let largestLoss = { value: Infinity, account: "", accountId: "" }

    data.forEach(item => {
      const pnlValue = parseFloat(item.pnl) || 0
      totalPnL += pnlValue

      // Track largest profit (highest positive PnL)
      if (pnlValue > largestProfit.value) {
        largestProfit = {
          value: pnlValue,
          account: item.account,
          accountId: item.id
        }
      }

      // Track largest loss (lowest negative PnL)
      if (pnlValue < largestLoss.value) {
        largestLoss = {
          value: pnlValue,
          account: item.account,
          accountId: item.id
        }
      }
    })

    return { totalPnL, largestProfit, largestLoss }
  }

  const { totalPnL, largestProfit, largestLoss } = calculateKPIs()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const handleAccountClick = (accountId: string, account: string) => {
    // Scroll to the account row in the table or show a highlight
    const accountElement = document.querySelector(`[data-account-id="${accountId}"]`)
    if (accountElement) {
      accountElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Add a temporary highlight effect
      accountElement.classList.add('bg-yellow-100', 'transition-colors', 'duration-1000')
      setTimeout(() => {
        accountElement.classList.remove('bg-yellow-100')
      }, 2000)
    }
  }

  return (
    <div className="px-6 py-4 bg-white border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total PnL */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total PnL</p>
                <p className={`text-xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalPnL)}
                </p>
                <p className="text-xs text-gray-500">Across {data.length} accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Largest Profit */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Largest Profit</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(largestProfit.value)}
                </p>
                {largestProfit.account && (
                  <button
                    onClick={() => handleAccountClick(largestProfit.accountId, largestProfit.account)}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                  >
                    Account: {largestProfit.account}
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Largest Loss */}
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Largest Loss</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(largestLoss.value)}
                </p>
                {largestLoss.account && (
                  <button
                    onClick={() => handleAccountClick(largestLoss.accountId, largestLoss.account)}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                  >
                    Account: {largestLoss.account}
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
