"use client"

import type { ReactNode } from "react"
import { DashboardHeader } from "./dashboard-header"
import type { UserPreferences } from "@/lib/types"

interface DashboardLayoutProps {
  children: ReactNode
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: UserPreferences["sortBy"]
  onSortChange: (sortBy: UserPreferences["sortBy"]) => void
  onAddBuyer: () => void
}

export const DashboardLayout = ({
  children,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onAddBuyer,
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onAddBuyer={onAddBuyer}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {children}
        </div>
      </main>
    </div>
  )
}
