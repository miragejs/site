import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { Router } from "../lib/router"

// This is weird
const routesService = new Router()

export default function DocsPage(props) {
  return (
    <ThreeColumnLayout routes={routesService.routesForFullPath("/examples")}>
      {props.children}
    </ThreeColumnLayout>
  )
}
