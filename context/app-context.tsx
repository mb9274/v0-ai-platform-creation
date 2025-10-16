"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  language: string
}

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  language: string
  setLanguage: (language: string) => void
  isOnline: boolean
  setIsOnline: (isOnline: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [language, setLanguage] = useState("English")
  const [isOnline, setIsOnline] = useState(true)

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        language,
        setLanguage,
        isOnline,
        setIsOnline,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
