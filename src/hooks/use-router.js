import { useContext } from "react"
import { RouterContext } from "../contexts/router"

export function useRouter() {
  let router = useContext(RouterContext)

  return router
}
