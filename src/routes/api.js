import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import useApiDocs from "../hooks/use-api-docs"
import { useRouter } from "../hooks/use-router"

export default function Api(props) {
  let router = useRouter()
  let { publicClasses } = useApiDocs()
  let publicClassRoutes = publicClasses.map(publicClass => ({
    label: publicClass.name,
    fullPath: `/api/classes/${publicClass.slug}`,
  }))

  const routes = [
    {
      label: "Classes",
      name: "Classes",
      fullPath: "/api/classes",
      routes: publicClassRoutes,
    },
  ]
  let activeRoute = publicClassRoutes.find(
    route => route.fullPath === router.activePath
  )

  let previousPage, nextPage
  if (activeRoute) {
    let activeIndex = publicClassRoutes.indexOf(activeRoute)
    if (activeIndex > 0) {
      previousPage = publicClassRoutes[activeIndex - 1]
    }

    if (activeIndex < publicClassRoutes.length - 1) {
      nextPage = publicClassRoutes[activeIndex + 1]
    }
  }

  return (
    <ThreeColumnLayout
      routes={routes}
      previousPage={previousPage}
      nextPage={nextPage}
    >
      {props.children}
    </ThreeColumnLayout>
  )
}
