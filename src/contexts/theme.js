import React, { useState } from "react"
import { useRouter } from "../hooks/use-router"

export const ThemeContext = React.createContext()

export function ThemeProvider({ children }) {
  let [themeLock, lockTheme] = useState(false)

  let unlockTheme = () => {
    lockTheme(null)
  }

  let router = useRouter()

  // if the theme is locked, use that. otherwise use the active page's theme
  // default to light.
  let theme = themeLock ? themeLock : router.activePage?.meta?.theme || "light"

  return (
    <ThemeContext.Provider value={{ theme, lockTheme, unlockTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
