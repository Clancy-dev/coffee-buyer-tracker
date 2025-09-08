"use client"

import { useState, useEffect } from "react"
import type { CoffeeBuyer, UserPreferences, ContactHistory } from "@/lib/types"
import { CoffeeBuyerAPI, UserPreferencesAPI } from "@/lib/api-client"
import { useAuth } from "@/hooks/use-auth"
import toast from "react-hot-toast"

export const useCoffeeBuyers = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [buyers, setBuyers] = useState<CoffeeBuyer[]>([])
  const [filteredBuyers, setFilteredBuyers] = useState<CoffeeBuyer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<UserPreferences["sortBy"]>("newest")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      // Don't load if auth is still loading or user is not authenticated
      if (authLoading || !isAuthenticated) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const loadedBuyers = await CoffeeBuyerAPI.getAllBuyers()
        setBuyers(loadedBuyers)

        // Get sort preference from user data (will be handled by auth system)
        const savedSort = localStorage.getItem("user-sort-preference")
        if (savedSort) {
          setSortBy(savedSort as UserPreferences["sortBy"])
        }
      } catch (error) {
        console.error("Error loading buyers:", error)
        toast.error("Failed to load buyers")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated, authLoading]) // Added dependencies for auth state

  // Update filtered and sorted buyers when data changes
  useEffect(() => {
    let result = searchQuery ? CoffeeBuyerAPI.searchBuyers(buyers, searchQuery) : buyers
    result = CoffeeBuyerAPI.sortBuyers(result, sortBy)
    setFilteredBuyers(result)
  }, [buyers, searchQuery, sortBy])

  const createBuyer = async (buyerData: Omit<CoffeeBuyer, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newBuyer = await CoffeeBuyerAPI.createBuyer(buyerData)
      setBuyers((prev) => [...prev, newBuyer])
      toast.success("Buyer created successfully")
      return newBuyer
    } catch (error) {
      console.error("Error creating buyer:", error)
      toast.error("Failed to create buyer")
      throw error
    }
  }

  const updateBuyer = async (id: string, updates: Partial<Omit<CoffeeBuyer, "id" | "createdAt">>) => {
    try {
      const updatedBuyer = await CoffeeBuyerAPI.updateBuyer(id, updates)
      setBuyers((prev) => prev.map((buyer) => (buyer.id === id ? updatedBuyer : buyer)))
      toast.success("Buyer updated successfully")
      return updatedBuyer
    } catch (error) {
      console.error("Error updating buyer:", error)
      toast.error("Failed to update buyer")
      throw error
    }
  }

  const deleteBuyer = async (id: string) => {
    try {
      await CoffeeBuyerAPI.deleteBuyer(id)
      setBuyers((prev) => prev.filter((buyer) => buyer.id !== id))
      toast.success("Buyer deleted successfully")
      return true
    } catch (error) {
      console.error("Error deleting buyer:", error)
      toast.error("Failed to delete buyer")
      return false
    }
  }

  const getBuyerById = (id: string) => {
    return buyers.find((buyer) => buyer.id === id) || null
  }

  const addContactHistory = async (buyerId: string, historyEntry: Omit<ContactHistory, "id">) => {
    try {
      await CoffeeBuyerAPI.addContactHistory(buyerId, historyEntry)
      // Refresh buyers data
      const updatedBuyers = await CoffeeBuyerAPI.getAllBuyers()
      setBuyers(updatedBuyers)
      toast.success("Contact history added")
      return true
    } catch (error) {
      console.error("Error adding contact history:", error)
      toast.error("Failed to add contact history")
      return false
    }
  }

  // Search and sort
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSort = async (newSortBy: UserPreferences["sortBy"]) => {
    try {
      setSortBy(newSortBy)
      // Save preference locally for immediate use
      localStorage.setItem("user-sort-preference", newSortBy)
      // Update on server
      await UserPreferencesAPI.updatePreferences({ sortPreference: newSortBy })
    } catch (error) {
      console.error("Error updating sort preference:", error)
      // Don't show error toast for this as it's not critical
    }
  }

  return {
    buyers: filteredBuyers,
    allBuyers: buyers,
    searchQuery,
    sortBy,
    isLoading,
    createBuyer,
    updateBuyer,
    deleteBuyer,
    getBuyerById,
    addContactHistory,
    handleSearch,
    handleSort,
  }
}
