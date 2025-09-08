export interface SocialMediaHandle {
  id?: string
  platform: "INSTAGRAM" | "X" | "TIKTOK" | "YOUTUBE" | "FACEBOOK" | "LINKEDIN" | "WHATSAPP"
  username: string
  url?: string
  buyerId?: string
  createdAt?: string
}

export interface ContactHistory {
  id: string
  contactType: "CALL" | "EMAIL" | "MESSAGE" | "MEETING" | "OTHER"
  message?: string
  contactDate: string
  createdAt: string
  buyerId: string
}

export interface CoffeeBuyer {
  id: string
  name: string
  socialMediaHandles: SocialMediaHandle[]
  phoneNumber?: string
  email?: string
  lastContacted?: string
  feedback?: string
  expectation: "HIGH" | "MEDIUM" | "LOW"
  contactHistory: ContactHistory[]
  createdAt: string
  updatedAt: string
  userId: string
}

export interface UserPreferences {
  sortBy: "newest" | "oldest" | "expectation-high" | "expectation-medium" | "expectation-low" | "a-z" | "z-a"
  theme: "light" | "dark" | "system"
}

export interface User {
  id: string
  email: string
  sortPreference?: string
  createdAt?: string
  updatedAt?: string
}

// Form data types
export interface BuyerFormData {
  name: string
  socialMediaHandles: SocialMediaHandle[]
  phoneNumber?: string
  email?: string
  lastContacted?: string
  feedback?: string
  expectation: "HIGH" | "MEDIUM" | "LOW"
}

export interface ContactHistoryFormData {
  contactType: "CALL" | "EMAIL" | "MESSAGE" | "MEETING" | "OTHER"
  message?: string
  contactDate?: string
}

// API Response types
export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface BuyersResponse {
  buyers: CoffeeBuyer[]
}

export interface BuyerResponse {
  buyer: CoffeeBuyer
}

export interface ContactHistoryResponse {
  contactHistory: ContactHistory
}
