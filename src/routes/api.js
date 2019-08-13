import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import RoutesService from "../lib/routes-service"

// This is weird
const routesService = new RoutesService()

export default function DocsPage(props) {
  return (
    <ThreeColumnLayout routes={routesService.routesForFullPath("/api")}>
      {props.children}
    </ThreeColumnLayout>
  )
}
