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
  customer: string
  orderNr: string
  name: string
  balance: string
  equity: string
  program: string
  platform: string
  platformStatus: string
  upgraded: string
  upgradedAccount: string
  repeatedAccount: string
  resetAccount: string
  status: string
  type: string
  serverGroup: string
  date: string
  firstName: string
  lastName: string
  email: string
  phone: string
  zipCode: string
  city: string
  state: string
  country: string
  breachReason: string
}
