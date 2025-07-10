export interface Column<T> {
  id: string
  header: string
  accessor: keyof T
  isRemovable?: boolean
  isDraggable?: boolean
  isVisible?: boolean
  width?: number // Added back for column resizing
}

export interface DataItem {
  id: string
  account: string
  orderNr: string
  customer: string
  name: string
  program: string
  platform: string
  platformStatus: string
  email: string
  country: string
  type: string
  serverGroup: string
  balance: string
  equity: string
  growth: string
  pnl: string
  level: string
  softBreaches: string
  copyTrading: string
  hedgeTrading: string
  ipCount: string
  avgLoss: string
  avgWin: string
  dailyStopOutBar: string
  overallStopOutBar: string
  maxWithdrawal: string
  targetEquityBar: string
  hwmBalance: string
  daysSinceDeposit: string
  activeTradingDays: string
  inactiveTradingDays: string
  firstTradeDate: string
  daysSinceFirstTrade: string
  lwmAllTrades: string
  consistencyBestWorstDay: string
  consistencyTopDay: string
}
