import type { CoffeeBuyer, UserPreferences, ContactHistory } from "./types"

const API_BASE = "/api"

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth-token")
}

//sample

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken()

  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || "Request failed")
  }

  return response.json()
}

// Authentication API
export class AuthAPI {
  static async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Login failed")
    }

    const data = await response.json()

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", data.token)
    }

    return data
  }

  static async register(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Registration failed")
    }

    const data = await response.json()

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", data.token)
    }

    return data
  }

  static async verifyToken() {
    return makeAuthenticatedRequest(`${API_BASE}/auth/verify`)
  }

  static logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token")
    }
  }
}

// Coffee Buyers API
export class CoffeeBuyerAPI {
  static async getAllBuyers(): Promise<CoffeeBuyer[]> {
    const data = await makeAuthenticatedRequest(`${API_BASE}/buyers`)
    return data.buyers
  }

  static async createBuyer(buyerData: Omit<CoffeeBuyer, "id" | "createdAt" | "updatedAt">): Promise<CoffeeBuyer> {
    const data = await makeAuthenticatedRequest(`${API_BASE}/buyers`, {
      method: "POST",
      body: JSON.stringify(buyerData),
    })
    return data.buyer
  }

  static async updateBuyer(id: string, updates: Partial<Omit<CoffeeBuyer, "id" | "createdAt">>): Promise<CoffeeBuyer> {
    const data = await makeAuthenticatedRequest(`${API_BASE}/buyers/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
    return data.buyer
  }

  static async deleteBuyer(id: string): Promise<void> {
    await makeAuthenticatedRequest(`${API_BASE}/buyers/${id}`, {
      method: "DELETE",
    })
  }

  static async addContactHistory(buyerId: string, historyEntry: Omit<ContactHistory, "id">): Promise<ContactHistory> {
    const data = await makeAuthenticatedRequest(`${API_BASE}/buyers/${buyerId}/contact-history`, {
      method: "POST",
      body: JSON.stringify(historyEntry),
    })
    return data.contactHistory
  }

  // Client-side search and sort functions
  static searchBuyers(buyers: CoffeeBuyer[], query: string): CoffeeBuyer[] {
    if (!query.trim()) return buyers

    const searchTerm = query.toLowerCase()

    return buyers.filter((buyer) => {
      // Search in name
      const nameMatch = buyer.name.toLowerCase().includes(searchTerm)

      // Search in social media handles
      const socialMediaMatch =
        buyer.socialMediaHandles?.some(
          (handle) =>
            handle.username.toLowerCase().includes(searchTerm) || handle.platform.toLowerCase().includes(searchTerm),
        ) || false

      // Search in other fields
      const phoneMatch = buyer.phoneNumber?.toLowerCase().includes(searchTerm) || false
      const emailMatch = buyer.email?.toLowerCase().includes(searchTerm) || false
      const feedbackMatch = buyer.feedback?.toLowerCase().includes(searchTerm) || false

      return nameMatch || socialMediaMatch || phoneMatch || emailMatch || feedbackMatch
    })
  }

  static sortBuyers(buyers: CoffeeBuyer[], sortBy: UserPreferences["sortBy"]): CoffeeBuyer[] {
    const sortedBuyers = [...buyers]

    switch (sortBy) {
      case "newest":
        return sortedBuyers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      case "oldest":
        return sortedBuyers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

      case "expectation-high":
        return sortedBuyers.sort((a, b) => {
          const expectationOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
          return expectationOrder[b.expectation] - expectationOrder[a.expectation]
        })

      case "expectation-medium":
        return sortedBuyers.sort((a, b) => {
          if (a.expectation === "MEDIUM" && b.expectation !== "MEDIUM") return -1
          if (b.expectation === "MEDIUM" && a.expectation !== "MEDIUM") return 1
          return 0
        })

      case "expectation-low":
        return sortedBuyers.sort((a, b) => {
          const expectationOrder = { LOW: 3, MEDIUM: 2, HIGH: 1 }
          return expectationOrder[b.expectation] - expectationOrder[a.expectation]
        })

      case "a-z":
        return sortedBuyers.sort((a, b) => a.name.localeCompare(b.name))

      case "z-a":
        return sortedBuyers.sort((a, b) => b.name.localeCompare(a.name))

      default:
        return sortedBuyers
    }
  }
}

// User Preferences API
export class UserPreferencesAPI {
  static async updatePreferences(preferences: { sortPreference: string }) {
    const data = await makeAuthenticatedRequest(`${API_BASE}/user/preferences`, {
      method: "PUT",
      body: JSON.stringify(preferences),
    })
    return data.user
  }
}

// Form data persistence (keep in localStorage for now as it's temporary data)
export class FormDataManager {
  static saveFormData(formId: string, data: any): void {
    if (typeof window === "undefined") return

    try {
      const allFormData = this.getAllFormData()
      allFormData[formId] = data
      localStorage.setItem("coffee-tracker-form-data", JSON.stringify(allFormData))
    } catch (error) {
      console.error("Error saving form data:", error)
    }
  }

  static getFormData(formId: string): any {
    if (typeof window === "undefined") return null

    try {
      const allFormData = this.getAllFormData()
      return allFormData[formId] || null
    } catch (error) {
      console.error("Error loading form data:", error)
      return null
    }
  }

  static clearFormData(formId: string): void {
    if (typeof window === "undefined") return

    try {
      const allFormData = this.getAllFormData()
      delete allFormData[formId]
      localStorage.setItem("coffee-tracker-form-data", JSON.stringify(allFormData))
    } catch (error) {
      console.error("Error clearing form data:", error)
    }
  }

  private static getAllFormData(): Record<string, any> {
    try {
      const stored = localStorage.getItem("coffee-tracker-form-data")
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Error loading all form data:", error)
      return {}
    }
  }
}
