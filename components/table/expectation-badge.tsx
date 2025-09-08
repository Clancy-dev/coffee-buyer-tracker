"use client"

import type { CoffeeBuyer } from "@/lib/types"

interface ExpectationBadgeProps {
  expectation: CoffeeBuyer["expectation"]
}

const expectationConfig = {
  high: {
    label: "High",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    dot: "bg-green-500",
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    dot: "bg-yellow-500",
  },
  low: {
    label: "Low",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    dot: "bg-red-500",
  },
}

export const ExpectationBadge = ({ expectation }: ExpectationBadgeProps) => {
  const config = expectationConfig[expectation]

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
      <span>{config.label}</span>
    </div>
  )
}
