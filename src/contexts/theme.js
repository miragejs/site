import React from "react"
import { useRouter } from "../hooks/use-router"

export const ThemeContext = React.createContext()

export function ThemeProvider({ children }) {
  let theme = "light" // default theme
  let router = useRouter()

  // activePage is not set for /api routes, once we fix this we should be able
  // to remove this conditional logic.
  if (router.activePage && router.activePage.meta.theme !== undefined) {
    theme = router.activePage.meta.theme
  }

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  )
}
