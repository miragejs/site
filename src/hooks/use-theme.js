import { useContext } from "react"
import { ThemeContext } from "../contexts/theme"

export function useTheme() {
  let themeContext = useContext(ThemeContext)

  return themeContext
}
