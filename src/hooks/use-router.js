import { useContext, useState } from "react"
import { RouterContext } from "../routes/app"
import { Router } from "../lib/router"

export function useRouter() {
  let [state, setState] = useState(null)
  let context = useContext(RouterContext)

  // Root component uses state, children use context
  let router = context || state

  // If there's no router, state in the root hasn't been initialized
  if (!router) {
    router = new Router()
    setState(router)
  }

  return router
}
