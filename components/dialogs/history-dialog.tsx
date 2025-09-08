"use client"

import { useState } from "react"
import { X, Calendar, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CoffeeBuyer, ContactHistory } from "@/lib/types"

interface HistoryDialogProps {
  buyer: CoffeeBuyer
  onClose: () => void
  onAddHistory: (buyer: CoffeeBuyer) => void
}

const contactTypeColors = {
  call: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  email: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  message: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  meeting: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

export const HistoryDialog = ({ buyer, onClose, onAddHistory }: HistoryDialogProps) => {
  const [filterType, setFilterType] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"timeline" | "calendar">("timeline")

  const filteredHistory = buyer.history.filter((entry) => {
    if (filterType === "all") return true
    return entry.type === filterType
  })

  const sortedHistory = filteredHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "Unknown"
    try {
      const date = new Date(dateStr)
      const dateFormatted = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      return timeStr ? `${dateFormatted} at ${timeStr}` : dateFormatted
    } catch {
      return `${dateStr} ${timeStr || ""}`.trim()
    }
  }

  const getCalendarData = () => {
    const calendarMap = new Map<string, ContactHistory[]>()

    buyer.history.forEach((entry) => {
      const dateKey = entry.date
      if (!calendarMap.has(dateKey)) {
        calendarMap.set(dateKey, [])
      }
      calendarMap.get(dateKey)!.push(entry)
    })

    return Array.from(calendarMap.entries()).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
  }

  const calendarData = getCalendarData()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-white dark:bg-gray-900 relative my-8 max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Contact History</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Complete timeline of interactions with this buyer
              </CardDescription>
            </div>
            <Button onClick={() => onAddHistory(buyer)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="call">Calls</SelectItem>
                  <SelectItem value="email">Emails</SelectItem>
                  <SelectItem value="message">Messages</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
                className={viewMode === "timeline" ? "bg-blue-600 text-white" : ""}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={viewMode === "calendar" ? "bg-blue-600 text-white" : ""}
              >
                Calendar
              </Button>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredHistory.length} {filteredHistory.length === 1 ? "entry" : "entries"}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {buyer.history.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No contact history</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start tracking your interactions with this buyer</p>
              <Button onClick={() => onAddHistory(buyer)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add First Contact
              </Button>
            </div>
          ) : viewMode === "timeline" ? (
            <div className="space-y-4">
              {sortedHistory.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {/* Timeline line */}
                  {index < sortedHistory.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200 dark:bg-gray-600"></div>
                  )}

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>

                    <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={contactTypeColors[entry.type]}>
                          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(entry.date, entry.time)}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white leading-relaxed">{entry.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {calendarData.map(([date, entries]) => (
                <div key={date} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h4>
                  <div className="space-y-3">
                    {entries
                      .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                      .map((entry) => (
                        <div
                          key={entry.id}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={contactTypeColors[entry.type]}>
                              {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                            </Badge>
                            {entry.time && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">{entry.time}</span>
                            )}
                          </div>
                          <p className="text-gray-900 dark:text-white text-sm leading-relaxed">{entry.message}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
