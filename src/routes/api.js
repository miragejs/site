import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import useApiDocs from "../hooks/use-api-docs"
import { useRouter } from "../hooks/use-router"
import SEO from "../components/seo"
import { Redirect } from "@reach/router"

export default function Api(props) {
  let router = useRouter()
  let { publicClasses } = useApiDocs()

  let publicClassRoutes = publicClasses.map(publicClass => ({
    label: publicClass.name,
    fullPath: `/api/classes/${publicClass.slug}`,
    activePath: router.activePath,
  }))

  const routes = [
    {
      label: "Classes",
      name: "Classes",
      fullPath: "/api/classes",
      routes: publicClassRoutes,
    },
  ]

  if (!router.activePage) {
    // we're rendering the API docs, but we don't have an active page which
    // most likely means we're rendering the index of some master view. let's
    // go ahead and redirect to the first API doc page.
    return (
      <Redirect
        to={router
          .routerFor("/api/classes/:classSlug")
          .buildUrl({ classSlug: publicClasses[0].slug })}
        noThrow
      />
    )
  }

  let activePublicClass = publicClasses.find(
    publicClass => publicClass.slug === router.activePage?.params?.classSlug
  )

  if (!activePublicClass) {
    // if there's no active public class, that means we're at a valid url, but
    // an invalid class: /api/classes/asdf. Let's throw a 404.
    throw router.errors.NOT_FOUND
  }

  let activePublicClassRoute = publicClassRoutes.find(
    publicClassRoute => publicClassRoute.label === activePublicClass?.name
  )

  let activeIndex = publicClassRoutes.indexOf(activePublicClassRoute)
  let previousPage = activeIndex > 0 ? publicClassRoutes[activeIndex - 1] : null
  let nextPage =
    activeIndex < publicClassRoutes.length - 1
      ? publicClassRoutes[activeIndex + 1]
      : null

  let tableOfContents = activePublicClass
    ? [
        ["Fields", activePublicClass.fields],
        ["Accessors", activePublicClass.accessors],
        ["Methods", activePublicClass.methods],
      ]
        .filter(([label, members]) => members.length > 0)
        .reduce((result, [label, members]) => {
          let items = members.map(member => ({
            title: member.name,
            url: `#${member.slug}`,
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
    : []

  return (
    <>
      <SEO title={activePublicClass?.name} />
      <ThreeColumnLayout
        routes={routes}
        previousPage={previousPage}
        nextPage={nextPage}
        // currentPageTableOfContentsItems={tableOfContents}
      >
        {props.children}
      </ThreeColumnLayout>
    </>
  )
}
