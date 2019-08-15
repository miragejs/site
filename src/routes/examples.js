import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"

export default function DocsPage(props) {
  let router = useRouter()

  return (
    <ThreeColumnLayout router={router.routerFor("/examples")}>
      {props.children}
    </ThreeColumnLayout>
  )
}
