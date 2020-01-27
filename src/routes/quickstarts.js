import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"

export default function QuickstartsPage(props) {
  let router = useRouter()

  let docsRouter = router.routerFor("/quickstarts")

  return (
    <ThreeColumnLayout
      routes={docsRouter.routes}
      previousPage={
        docsRouter.previousPage &&
        router.activePage.parent === docsRouter.previousPage.parent
          ? docsRouter.previousPage
          : null
      }
      nextPage={
        docsRouter.nextPage &&
        router.activePage.parent === docsRouter.nextPage.parent
          ? docsRouter.nextPage
          : null
      }
    >
      {props.children}
    </ThreeColumnLayout>
  )
}
