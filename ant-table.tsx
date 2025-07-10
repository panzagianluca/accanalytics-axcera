"use client"

import React, { useState, useMemo } from 'react'
import { 
  Table, 
  Input, 
  Button, 
  Space, 
  Tag, 
  Dropdown, 
  Checkbox, 
  Card, 
  Typography, 
  Badge,
  Tooltip,
  Select,
  DatePicker,
  Drawer
} from 'antd'
import { 
  SearchOutlined, 
  FilterOutlined, 
  SettingOutlined, 
  DownloadOutlined,
  ReloadOutlined,
  ColumnHeightOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import type { ColumnsType, TableProps } from 'antd/es/table'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import { mockData } from './data'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select

interface DataType {
  key: string
  account: string
  customer: string
  orderNr: string
  name: string
  balance: string
  equity: string
  program: string
  platform: string
  platformStatus: string
  status: string
  type: string
  email: string
  phone: string
  city: string
  country: string
}

// Convert mock data to Ant Design format
const tableData: DataType[] = mockData.map(item => ({
  key: item.id,
  account: item.account,
  customer: item.customer,
  orderNr: item.orderNr,
  name: item.name,
  balance: item.balance,
  equity: item.equity,
  program: item.program,
  platform: item.platform,
  platformStatus: item.platformStatus,
  status: item.status,
  type: item.type,
  email: item.email,
  phone: item.phone,
  city: item.city,
  country: item.country,
}))

// Custom filter dropdown for advanced filtering
const getColumnSearchProps = (dataIndex: keyof DataType) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters && clearFilters()}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
  ),
  onFilter: (value: any, record: DataType) =>
    record[dataIndex]
      ?.toString()
      .toLowerCase()
      .includes((value as string).toLowerCase()),
})

export default function AntTable() {
  const [searchText, setSearchText] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'account', 'customer', 'name', 'balance', 'status', 'platform', 'email'
  ])
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false)
  const [tableSize, setTableSize] = useState<'small' | 'middle' | 'large'>('middle')

  // Define all available columns
  const allColumns: ColumnsType<DataType> = [
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
      width: 100,
      fixed: 'left',
      sorter: (a, b) => a.account.localeCompare(b.account),
      ...getColumnSearchProps('account'),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 120,
      sorter: (a, b) => a.customer.localeCompare(b.customer),
      ...getColumnSearchProps('customer'),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name'),
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      width: 120,
      sorter: (a, b) => parseFloat(a.balance.replace(/[$,]/g, '')) - parseFloat(b.balance.replace(/[$,]/g, '')),
      render: (text) => (
        <Text style={{ color: parseFloat(text.replace(/[$,]/g, '')) > 10000 ? '#52c41a' : '#1677ff' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Suspended', value: 'Suspended' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const colors: Record<string, string> = {
          'Active': 'green',
          'Inactive': 'red',
          'Pending': 'orange',
          'Suspended': 'volcano'
        }
        return <Tag color={colors[status] || 'default'}>{status}</Tag>
      }
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      filters: [
        { text: 'MT4', value: 'MT4' },
        { text: 'MT5', value: 'MT5' },
        { text: 'cTrader', value: 'cTrader' },
        { text: 'DXTrade', value: 'DXTrade' },
      ],
      onFilter: (value, record) => record.platform === value,
      render: (platform) => <Badge count={platform} style={{ backgroundColor: '#1677ff' }} />
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ...getColumnSearchProps('email'),
      render: (email) => <Text copyable>{email}</Text>
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      width: 120,
      ...getColumnSearchProps('city'),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      width: 120,
      filters: [
        { text: 'USA', value: 'USA' },
        { text: 'UK', value: 'UK' },
        { text: 'Canada', value: 'Canada' },
        { text: 'Australia', value: 'Australia' },
      ],
      onFilter: (value, record) => record.country === value,
    },
    {
      title: 'Equity',
      dataIndex: 'equity',
      key: 'equity',
      width: 120,
      sorter: (a, b) => parseFloat(a.equity.replace(/[$,]/g, '')) - parseFloat(b.equity.replace(/[$,]/g, '')),
    },
    {
      title: 'Program',
      dataIndex: 'program',
      key: 'program',
      width: 150,
    },
    {
      title: 'Order Nr',
      dataIndex: 'orderNr',
      key: 'orderNr',
      width: 120,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
  ]

  // Filter columns based on visibility
  const displayColumns = allColumns.filter(col => visibleColumns.includes(col.key as string))

  // Filter data based on global search
  const filteredData = useMemo(() => {
    if (!searchText) return tableData
    
    return tableData.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    )
  }, [searchText])

  // Column settings menu
  const columnMenuItems = allColumns.map(col => ({
    key: col.key,
    label: (
      <Checkbox
        checked={visibleColumns.includes(col.key as string)}
        onChange={(e) => {
          if (e.target.checked) {
            setVisibleColumns([...visibleColumns, col.key as string])
          } else {
            setVisibleColumns(visibleColumns.filter(key => key !== col.key))
          }
        }}
      >
        {col.title}
      </Checkbox>
    ),
  }))

  const tableProps: TableProps<DataType> = {
    columns: displayColumns,
    dataSource: filteredData,
    size: tableSize,
    scroll: { x: 1500, y: 600 },
    pagination: {
      total: filteredData.length,
      pageSize: 20,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
    },
    rowSelection: {
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('Selected:', selectedRowKeys, selectedRows)
      },
    },
    bordered: true,
    sticky: true,
  }

  return (
    <Card 
      style={{ margin: 24 }}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header */}
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #f0f0f0',
        background: 'linear-gradient(90deg, #fafafa 0%, #f5f5f5 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Customer Management
            </Title>
            <Text type="secondary">
              Showing {filteredData.length} of {tableData.length} customers
            </Text>
          </div>
          
          <Space size="middle">
            {/* Global Search */}
            <Search
              placeholder="Search all customers..."
              allowClear
              size="large"
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
            
            {/* Table Size */}
            <Select
              value={tableSize}
              onChange={setTableSize}
              style={{ width: 100 }}
            >
              <Option value="small">Small</Option>
              <Option value="middle">Medium</Option>
              <Option value="large">Large</Option>
            </Select>
            
            {/* Column Settings */}
            <Tooltip title="Column Settings">
              <Button
                icon={<SettingOutlined />}
                onClick={() => setColumnSettingsOpen(true)}
              >
                Columns ({visibleColumns.length})
              </Button>
            </Tooltip>
            
            {/* Export */}
            <Tooltip title="Export Data">
              <Button icon={<DownloadOutlined />}>
                Export
              </Button>
            </Tooltip>
          </Space>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: 24 }}>
        <Table {...tableProps} />
      </div>

      {/* Column Settings Drawer */}
      <Drawer
        title="Column Settings"
        open={columnSettingsOpen}
        onClose={() => setColumnSettingsOpen(false)}
        width={400}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Title level={5}>Visible Columns</Title>
            <Text type="secondary">
              Select which columns to display in the table
            </Text>
          </div>
          
          <div style={{ marginTop: 16 }}>
            {allColumns.map(col => (
              <div key={col.key} style={{ 
                padding: '8px 0', 
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Checkbox
                  checked={visibleColumns.includes(col.key as string)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setVisibleColumns([...visibleColumns, col.key as string])
                    } else {
                      setVisibleColumns(visibleColumns.filter(key => key !== col.key))
                    }
                  }}
                >
                  {col.title}
                </Checkbox>
                {visibleColumns.includes(col.key as string) ? (
                  <EyeOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <EyeInvisibleOutlined style={{ color: '#d9d9d9' }} />
                )}
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: 24 }}>
            <Space>
              <Button onClick={() => setVisibleColumns(allColumns.map(col => col.key as string))}>
                Show All
              </Button>
              <Button onClick={() => setVisibleColumns(['account', 'customer', 'name', 'status'])}>
                Reset to Default
              </Button>
            </Space>
          </div>
        </Space>
      </Drawer>
    </Card>
  )
}
