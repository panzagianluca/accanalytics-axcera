"use client"

import React from 'react'
import { ConfigProvider } from 'antd'

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontSize: 14,
        },
        components: {
          Table: {
            headerBg: '#fafafa',
            headerColor: '#262626',
            rowHoverBg: '#f5f5f5',
          },
          Button: {
            primaryShadow: '0 2px 0 rgba(5, 145, 255, 0.1)',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
