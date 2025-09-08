"use client"
import { X, Calendar, Clock, Phone, Mail, MessageSquare, ExternalLink, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExpectationBadge } from "@/components/table/expectation-badge"
import type { CoffeeBuyer } from "@/lib/types"

interface BuyerDetailsDialogProps {
  buyer: CoffeeBuyer
  onClose: () => void
  onEdit: (buyer: CoffeeBuyer) => void
  onAddHistory: (buyer: CoffeeBuyer) => void
}

const platformColors = {
  instagram: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  x: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  tiktok: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  youtube: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  facebook: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  linkedin: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  whatsapp: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

const contactTypeColors = {
  call: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  email: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  message: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  meeting: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

export const BuyerDetailsDialog = ({ buyer, onClose, onEdit, onAddHistory }: BuyerDetailsDialogProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Never"
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  const formatDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "Unknown"
    try {
      const date = new Date(dateStr)
      const dateFormatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      return timeStr ? `${dateFormatted} at ${timeStr}` : dateFormatted
    } catch {
      return `${dateStr} ${timeStr || ""}`.trim()
    }
  }

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
              <CardTitle className="text-gray-900 dark:text-white">Buyer Details</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Complete information and contact history
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => onAddHistory(buyer)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
              <Button onClick={() => onEdit(buyer)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Edit Buyer
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{buyer.phoneNumber || "No phone number"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{buyer.email || "No email address"}</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media</h3>
                {buyer.socialMediaHandles.length > 0 ? (
                  <div className="space-y-3">
                    {buyer.socialMediaHandles.map((handle, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Badge className={platformColors[handle.platform]}>
                          {handle.platform.charAt(0).toUpperCase() + handle.platform.slice(1)}
                        </Badge>
                        <a
                          href={handle.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
                        >
                          <span>@{handle.username}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No social media handles</p>
                )}
              </div>

              {/* Last Contact & Expectation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Contacted</h4>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <div className="text-gray-900 dark:text-white">{formatDate(buyer.dateLastContacted)}</div>
                      {buyer.timeLastContacted && (
                        <div className="text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{buyer.timeLastContacted}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expectation</h4>
                  <ExpectationBadge expectation={buyer.expectation} />
                </div>
              </div>

              {/* Feedback */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feedback & Notes</h3>
                {buyer.feedback ? (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                      {buyer.feedback}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No feedback recorded</p>
                )}
              </div>
            </div>

            {/* Right Column - Contact History */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact History</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {buyer.history.length} {buyer.history.length === 1 ? "entry" : "entries"}
                </span>
              </div>

              {buyer.history.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {buyer.history
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={contactTypeColors[entry.type]}>
                            {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDateTime(entry.date, entry.time)}
                          </span>
                        </div>
                        <p className="text-gray-900 dark:text-white text-sm leading-relaxed">{entry.message}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No contact history yet</p>
                  <Button
                    onClick={() => onAddHistory(buyer)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Contact
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
