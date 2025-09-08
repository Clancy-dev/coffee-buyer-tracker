export interface User {
  id: string
  email: string
  sortPreference?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const getAuthToken = (): string | null => {
  // This function is now only used by API routes that have access to cookies
  // Client components should use server actions instead
  return null
}
