import { useContext } from "react"
import { RouterContext } from "../routes/app"
import { Router } from "../lib/router"

export function useRouter() {
  let oldRouter = useContext(RouterContext)
  console.log("old is: ", oldRouter)
  // return oldRouter || new Router()
  return oldRouter || { x: "foobar" }
}
