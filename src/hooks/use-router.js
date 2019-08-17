import { useContext } from "react"
import { RouterContext } from "../routes/app"
import { Router } from "../lib/router"

export function useRouter() {
  let contextRouter = useContext(RouterContext)
  let router = contextRouter || new Router()
  return router
}
