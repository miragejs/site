import { useContext } from "react"
import { RouterContext } from "../routes/app"
import { Router } from "../lib/router"

export function useRouter() {
  let router = useContext(RouterContext)

  if (!router) {
    router = new Router()
  }

  return router
}
