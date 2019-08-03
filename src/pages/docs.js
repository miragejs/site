import { useEffect } from "react"
import { navigate } from "gatsby"

export default () => {
  useEffect(() => {
    navigate("/docs/getting-started/introduction")
  }, [])
  return null
}
