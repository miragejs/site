import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import useApiDocs from "../hooks/use-api-docs"
import { useRouter } from "../hooks/use-router"

export default function Api(props) {
  let { publicClasses } = useApiDocs()

  let router = useRouter()
  let classRouter = router.routerFor("/api/classes")

  publicClasses
    .filter(publicClass => !classRouter.has({ name: publicClass.name }))
    .forEach(publicClass =>
      classRouter.add({
        name: publicClass.name,
        label: publicClass.name,
        path: `/${publicClass.slug}`,
      })
    )

  return (
    <ThreeColumnLayout router={router.routerFor("/api")}>
      {props.children}
    </ThreeColumnLayout>
  )
}
