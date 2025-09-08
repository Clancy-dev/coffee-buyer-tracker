"use client"
import { Calendar, Clock, Phone, Mail } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SocialMediaCell } from "./social-media-cell"
import { FeedbackDialog } from "./feedback-dialog"
import { ExpectationBadge } from "./expectation-badge"
import { ActionsMenu } from "./actions-menu"
import type { CoffeeBuyer } from "@/lib/types"

interface BuyersTableProps {
  buyers: CoffeeBuyer[]
  onEdit: (buyer: CoffeeBuyer) => void
  onDelete: (buyerId: string) => void
  onViewDetails: (buyer: CoffeeBuyer) => void
  onViewHistory: (buyer: CoffeeBuyer) => void
}

export const BuyersTable = ({ buyers, onEdit, onDelete, onViewDetails, onViewHistory }: BuyersTableProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Never"
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  const formatTime = (timeStr: string) => {
    if (!timeStr) return ""
    return timeStr
  }

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-700">
              <TableHead className="text-gray-900 dark:text-white font-semibold">No.</TableHead>
              <TableHead className="text-gray-900 dark:text-white font-semibold">Name</TableHead>
              <TableHead className="text-gray-900 dark:text-white font-semibold">Social Contact</TableHead>
              <TableHead className="text-gray-900 dark:text-white font-semibold">Phone Number</TableHead>
              <TableHead className="text-gray-900 dark:text-white font-semibold">Email</TableHead>
              <TableHead className="text-gray-900 dark:text-white font-semibold">Date/Time Last Contacted</TableHead>
              <TableHead className="text-gray-900 dark:text-white font-semibold">Feedback</TableHead>
              <TableHead className="text-gray-900 dark:text-white font-semibold">Expectation</TableHead>
              <TableHead className="text-gray-900 dark:text-white font-semibold">History</TableHead>
              <TableHead className="text-gray-900 dark:text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buyers.map((buyer, index) => (
              <TableRow
                key={buyer.id}
                className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <TableCell className="text-gray-900 dark:text-white font-medium">{index + 1}</TableCell>
                <TableCell>
                  <span className="text-gray-900 dark:text-white font-medium">{buyer.name || "Unnamed Buyer"}</span>
                </TableCell>
                <TableCell>
                  <SocialMediaCell handles={buyer.socialMediaHandles} />
                </TableCell>
                <TableCell>
                  {buyer.phoneNumber ? (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{buyer.phoneNumber}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">No phone</span>
                  )}
                </TableCell>
                <TableCell>
                  {buyer.email ? (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{buyer.email}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">No email</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <div className="text-gray-900 dark:text-white">{formatDate(buyer.dateLastContacted)}</div>
                      {buyer.timeLastContacted && (
                        <div className="text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(buyer.timeLastContacted)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <FeedbackDialog feedback={buyer.feedback} />
                </TableCell>
                <TableCell>
                  <ExpectationBadge expectation={buyer.expectation} />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onViewHistory(buyer)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{buyer.history.length} entries</span>
                  </button>
                </TableCell>
                <TableCell>
                  <ActionsMenu buyer={buyer} onEdit={onEdit} onDelete={onDelete} onViewDetails={onViewDetails} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {buyers.map((buyer, index) => (
          <div
            key={buyer.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {buyer.name || "Unnamed Buyer"}
                </span>
              </div>
              <ActionsMenu buyer={buyer} onEdit={onEdit} onDelete={onDelete} onViewDetails={onViewDetails} />
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Social Media</h4>
                <SocialMediaCell handles={buyer.socialMediaHandles} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</h4>
                  {buyer.phoneNumber ? (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white text-sm">{buyer.phoneNumber}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">No phone</span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</h4>
                  {buyer.email ? (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white text-sm">{buyer.email}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">No email</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Contacted</h4>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <span className="text-gray-900 dark:text-white">{formatDate(buyer.dateLastContacted)}</span>
                    {buyer.timeLastContacted && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        at {formatTime(buyer.timeLastContacted)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expectation</h4>
                <ExpectationBadge expectation={buyer.expectation} />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback</h4>
                <FeedbackDialog feedback={buyer.feedback} />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">History</h4>
                <button
                  onClick={() => onViewHistory(buyer)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{buyer.history.length} entries</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
