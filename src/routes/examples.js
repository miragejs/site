import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"

export default function ExamplesPage(props) {
  let router = useRouter()

  let docsRouter = router.routerFor("/examples")

  return (
    <ThreeColumnLayout
      routes={docsRouter.routes}
      previousPage={docsRouter.previousPage}
      nextPage={docsRouter.nextPage}
    >
      {props.children}
    </ThreeColumnLayout>
  )
}
