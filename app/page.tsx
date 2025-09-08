"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useCoffeeBuyers } from "@/hooks/use-coffee-buyers"
import { AuthForm } from "@/components/auth/auth-form"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EmptyState } from "@/components/ui/empty-state"
import { BuyerForm } from "@/components/forms/buyer-form"
import { BuyersTable } from "@/components/table/buyers-table"
import { BuyerDetailsDialog } from "@/components/dialogs/buyer-details-dialog"
import { HistoryDialog } from "@/components/dialogs/history-dialog"
import { ContactHistoryForm } from "@/components/forms/contact-history-form"
import { Button } from "@/components/ui/button"
import type { BuyerFormData, CoffeeBuyer, ContactHistoryFormData } from "@/lib/types"

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    buyers,
    searchQuery,
    sortBy,
    isLoading: buyersLoading,
    handleSearch,
    handleSort,
    createBuyer,
    updateBuyer,
    deleteBuyer,
    getBuyerById,
    addContactHistory,
  } = useCoffeeBuyers()

  const [showAuthForm, setShowAuthForm] = useState(false)
  const [showBuyerForm, setShowBuyerForm] = useState(false)
  const [editingBuyer, setEditingBuyer] = useState<string | null>(null)
  const [viewingBuyerDetails, setViewingBuyerDetails] = useState<CoffeeBuyer | null>(null)
  const [viewingBuyerHistory, setViewingBuyerHistory] = useState<CoffeeBuyer | null>(null)
  const [addingHistoryFor, setAddingHistoryFor] = useState<CoffeeBuyer | null>(null)

  const handleSaveBuyer = async (data: BuyerFormData) => {
    try {
      if (editingBuyer) {
        await updateBuyer(editingBuyer, data)
      } else {
        await createBuyer({
          ...data,
          contactHistory: [],
        })
      }
      closeBuyerForm()
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleDeleteBuyer = async (id: string) => {
    try {
      await deleteBuyer(id)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleSaveContactHistory = async (buyerId: string, data: ContactHistoryFormData) => {
    try {
      await addContactHistory(buyerId, data)
      setAddingHistoryFor(null)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const openAddForm = () => {
    setEditingBuyer(null)
    setShowBuyerForm(true)
  }

  const openEditForm = (buyer: CoffeeBuyer) => {
    setEditingBuyer(buyer.id)
    setShowBuyerForm(true)
  }

  const closeBuyerForm = () => {
    setShowBuyerForm(false)
    setEditingBuyer(null)
  }

  const handleViewDetails = (buyer: CoffeeBuyer) => {
    setViewingBuyerDetails(buyer)
  }

  const handleViewHistory = (buyer: CoffeeBuyer) => {
    setViewingBuyerHistory(buyer)
  }

  const handleAddHistory = (buyer: CoffeeBuyer) => {
    setAddingHistoryFor(buyer)
    setViewingBuyerDetails(null)
    setViewingBuyerHistory(null)
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  // Show authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="space-y-2">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Coffee Buyer Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Manage your coffee buyers, track potential clients, and organize your leads all in one place.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setShowAuthForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full"
            >
              Get Started
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track contacts, manage expectations, and grow your coffee business
            </p>
          </div>
        </div>

        {showAuthForm && <AuthForm onClose={() => setShowAuthForm(false)} />}
      </div>
    )
  }

  // Show dashboard
  return (
    <DashboardLayout
      searchQuery={searchQuery}
      onSearchChange={handleSearch}
      sortBy={sortBy}
      onSortChange={handleSort}
      onAddBuyer={openAddForm}
    >
      {buyersLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : buyers.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No buyers found" : "No coffee buyers yet"}
          description={
            searchQuery
              ? `No buyers match "${searchQuery}". Try adjusting your search terms.`
              : "Start building your network by adding your first coffee buyer. Track their preferences, contact history, and expectations."
          }
          actionLabel={searchQuery ? undefined : "Add Your First Buyer"}
          onAction={searchQuery ? undefined : openAddForm}
        />
      ) : (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Coffee Buyers ({buyers.length})</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {searchQuery ? `Showing results for "${searchQuery}"` : "Manage your coffee buyer network"}
              </p>
            </div>
          </div>

          <BuyersTable
            buyers={buyers}
            onEdit={openEditForm}
            onDelete={handleDeleteBuyer}
            onViewDetails={handleViewDetails}
            onViewHistory={handleViewHistory}
          />
        </div>
      )}

      {/* Forms and Dialogs */}
      {showBuyerForm && (
        <BuyerForm
          buyer={editingBuyer ? getBuyerById(editingBuyer) : null}
          onClose={closeBuyerForm}
          onSave={handleSaveBuyer}
          onDelete={handleDeleteBuyer}
        />
      )}

      {viewingBuyerDetails && (
        <BuyerDetailsDialog
          buyer={viewingBuyerDetails}
          onClose={() => setViewingBuyerDetails(null)}
          onEdit={openEditForm}
          onAddHistory={handleAddHistory}
        />
      )}

      {viewingBuyerHistory && (
        <HistoryDialog
          buyer={viewingBuyerHistory}
          onClose={() => setViewingBuyerHistory(null)}
          onAddHistory={handleAddHistory}
        />
      )}

      {addingHistoryFor && (
        <ContactHistoryForm
          buyer={addingHistoryFor}
          onClose={() => setAddingHistoryFor(null)}
          onSave={handleSaveContactHistory}
        />
      )}
    </DashboardLayout>
  )
}
