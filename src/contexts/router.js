import React from "react"
import { Router } from "../lib/router"

export const RouterContext = React.createContext()

const router = new Router()

export function RouterProvider(props) {
  router.activePath = props.location.pathname

  return (
    <RouterContext.Provider value={router}>
      {props.children}
    </RouterContext.Provider>
  )
}
