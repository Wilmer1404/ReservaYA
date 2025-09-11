import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  // Mock de usuario (ajústalo cuando tengas auth real)
  const [user] = useState({ id: 1, name: 'María González', email: 'maria.gonzalez@universidad.edu', role: 'STUDENT'})
  return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
