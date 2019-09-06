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
    route =>
      route.fullPath === router.activePath ||
      `${route.fullPath}/` === router.activePath
  )

  let activePublicClass = publicClasses.find(publicClass => {
    return activeRoute && publicClass.name === activeRoute.label
  })

  let activeIndex = publicClassRoutes.indexOf(activeRoute)
  let previousPage =
    activeIndex > 0 ? publicClassRoutes.indexOf(activeRoute) : null
  let nextPage =
    activeIndex < publicClassRoutes.length - 1
      ? publicClassRoutes[activeIndex + 1]
      : null

  console.log(activePublicClass.blocks)

  let tableOfContents = [
    ["Accessors", activePublicClass.accessors],
    ["Fields", activePublicClass.fields],
    ["Methods", activePublicClass.methods],
  ].reduce((result, [label, members]) => {
    let items = members.map(member => ({
      title: member.name,
      url: `#${member.longname}`,
    }))

    return [
      ...result,
      {
        title: label,
        url: `#${label}`,
        items,
      },
    ]
  }, [])

  return (
    <ThreeColumnLayout
      routes={routes}
      previousPage={previousPage}
      nextPage={nextPage}
      currentPageTableOfContentsItems={tableOfContents}
    >
      {props.children}
    </ThreeColumnLayout>
  )
}
