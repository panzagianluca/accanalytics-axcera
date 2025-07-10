import type { Column, DataItem } from "./types"

export const initialColumns: Column<DataItem>[] = [
  { id: "account", header: "Account", accessor: "account", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "customer", header: "Customer", accessor: "customer", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "orderNr", header: "Order Nr", accessor: "orderNr", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "name", header: "Name", accessor: "name", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "balance", header: "Balance", accessor: "balance", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "equity", header: "Equity", accessor: "equity", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "program", header: "Program", accessor: "program", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "platform", header: "Platform", accessor: "platform", isDraggable: true, isRemovable: true, isVisible: true },
  {
    id: "platformStatus",
    header: "Platform Status",
    accessor: "platformStatus",
    isDraggable: true,
    isRemovable: true,
    isVisible: true,
  },
  { id: "upgraded", header: "Upgraded", accessor: "upgraded", isDraggable: true, isRemovable: true, isVisible: true },
  {
    id: "upgradedAccount",
    header: "Upgraded Account",
    accessor: "upgradedAccount",
    isDraggable: true,
    isRemovable: true,
    isVisible: true,
  },
  {
    id: "repeatedAccount",
    header: "Repeated Account",
    accessor: "repeatedAccount",
    isDraggable: true,
    isRemovable: true,
    isVisible: true,
  },
  {
    id: "resetAccount",
    header: "Reset Account",
    accessor: "resetAccount",
    isDraggable: true,
    isRemovable: true,
    isVisible: true,
  },
  { id: "status", header: "Status", accessor: "status", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "type", header: "Type", accessor: "type", isDraggable: true, isRemovable: true, isVisible: true },
  {
    id: "serverGroup",
    header: "Server Group",
    accessor: "serverGroup",
    isDraggable: true,
    isRemovable: true,
    isVisible: true,
  },
  { id: "date", header: "Date", accessor: "date", isDraggable: true, isRemovable: true, isVisible: true },
  {
    id: "firstName",
    header: "First Name",
    accessor: "firstName",
    isDraggable: true,
    isRemovable: true,
    isVisible: true,
  },
  {
    id: "lastName",
    header: "Last Name",
    accessor: "lastName",
    isDraggable: true,
    isRemovable: true,
    isVisible: true,
  },
  { id: "email", header: "Email", accessor: "email", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "phone", header: "Phone", accessor: "phone", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "zipCode", header: "Zip Code", accessor: "zipCode", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "city", header: "City", accessor: "city", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "state", header: "State", accessor: "state", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "country", header: "Country", accessor: "country", isDraggable: true, isRemovable: true, isVisible: true },
  {
    id: "breachReason",
    header: "Breach Reason",
    accessor: "breachReason",
    isDraggable: true,
    isRemovable: true,
    isVisible: true,
  },
]

// For now, allAvailableColumns is the same as initialColumns.
// If you want to add more columns that are not initially visible but can be added,
// you would add them here with isVisible: false.
export const allAvailableColumns: Column<DataItem>[] = [...initialColumns]

// Sample data arrays for randomization
const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Peter", "Quinn", "Rachel", "Sam", "Tina"]
const lastNames = ["Johnson", "Smith", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis"]
const platforms = ["MetaTrader 4", "MetaTrader 5", "cTrader", "DXTrade", "TradingView"]
const statuses = ["Active", "Inactive", "Pending", "Suspended", "Closed"]
const programs = ["Standard", "Premium", "VIP", "Demo", "Professional"]
const platformStatuses = ["Connected", "Disconnected", "Error", "Maintenance", "Testing"]
const accountTypes = ["Live", "Demo", "Practice", "Paper", "Simulation"]
const serverGroups = ["SG-USA-01", "SG-EUR-02", "SG-ASIA-03", "SG-UK-04", "SG-AU-05"]
const cities = ["New York", "London", "Tokyo", "Sydney", "Toronto", "Berlin", "Paris", "Madrid", "Rome", "Amsterdam"]
const states = ["NY", "CA", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"]
const countries = ["USA", "UK", "Germany", "France", "Canada", "Australia", "Japan", "Spain", "Italy", "Netherlands"]
const breachReasons = ["Daily Loss Limit", "Max Loss Limit", "Consistency Rule", "News Trading", "Weekend Gap", "Lot Size Violation", "Time Violation", "No Breach"]

// Function to generate random data
function generateRandomRecord(id: number): DataItem {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const platform = platforms[Math.floor(Math.random() * platforms.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  return {
    id: id.toString(),
    account: `ACC${String(id).padStart(3, '0')}`,
    customer: `Cust${String.fromCharCode(65 + (id % 26))}`,
    orderNr: `ORD${1000 + id}`,
    name: `${firstName} ${lastName}`,
    balance: `$${(Math.random() * 100000 + 1000).toFixed(2)}`,
    equity: `$${(Math.random() * 95000 + 950).toFixed(2)}`,
    program: programs[Math.floor(Math.random() * programs.length)],
    platform: platform,
    platformStatus: platformStatuses[Math.floor(Math.random() * platformStatuses.length)],
    upgraded: Math.random() > 0.5 ? "Yes" : "No",
    upgradedAccount: Math.random() > 0.7 ? `UPG${String(id).padStart(3, '0')}` : "N/A",
    repeatedAccount: Math.random() > 0.8 ? `REP${String(id).padStart(3, '0')}` : "N/A",
    resetAccount: Math.random() > 0.9 ? `RST${String(id).padStart(3, '0')}` : "N/A",
    status: status,
    type: accountTypes[Math.floor(Math.random() * accountTypes.length)],
    serverGroup: serverGroups[Math.floor(Math.random() * serverGroups.length)],
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
    firstName: firstName,
    lastName: lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    zipCode: String(Math.floor(Math.random() * 90000 + 10000)),
    city: cities[Math.floor(Math.random() * cities.length)],
    state: states[Math.floor(Math.random() * states.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    breachReason: breachReasons[Math.floor(Math.random() * breachReasons.length)]
  }
}

// Generate 100 random records
export const mockData: DataItem[] = Array.from({ length: 100 }, (_, index) => generateRandomRecord(index + 1))
