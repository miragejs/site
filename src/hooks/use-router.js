import { useContext, useState } from "react"
import { RouterContext } from "../routes/app"
import { Router } from "../lib/router"

export function useRouter() {
  // this is really only used by the root component, since
  // if we're calling this hook from any other component then
  // context will be available.
  let [state, setState] = useState(null)

  // this is used by every child component.
  let context = useContext(RouterContext)

  let router = context || state

  if (!router) {
    console.log("creating a router")
    // we're in the root component!
    router = new Router()
    setState(router)
  }

  return router
}
