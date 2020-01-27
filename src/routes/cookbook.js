import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"

export default function QuickstartsPage(props) {
  let router = useRouter().routerFor("/cookbook")

  return (
    <ThreeColumnLayout
      routes={router.routes}
      previousPage={router.previousPage}
      nextPage={router.nextPage}
    >
      {props.children}
    </ThreeColumnLayout>
  )
}
