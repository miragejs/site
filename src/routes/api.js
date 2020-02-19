import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import useApiDocs from "../hooks/use-api-docs"
import { useRouter } from "../hooks/use-router"
import SEO from "../components/seo"
import { Redirect } from "@reach/router"

export default function Api(props) {
  let router = useRouter()
  let { publicClasses } = useApiDocs()

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

  let menuItems = publicClasses.map(publicClass => ({
    label: publicClass.name,
    url: `/api/classes/${publicClass.slug}/`,
    headings: [
      ["Properties", publicClass.properties],
      ["Methods", publicClass.methods],
    ]
      .filter(([label, members]) => members.length > 0)
      .reduce((result, [label, members]) => {
        let items = members.map(member => ({
          label: member.name,
          anchor: `#${member.slug}`,
        }))

        return [
          ...result,
          {
            label: label,
            anchor: `#${label.toLowerCase()}`,
            headings: items,
          },
        ]
      }, []),
  }))

  let activePublicClass = publicClasses.find(
    publicClass => publicClass.slug === router.activePage?.params?.classSlug
  )

  if (!activePublicClass) {
    // if there's no active public class, that means we're at a valid url, but
    // an invalid class: /api/classes/asdf. Let's throw a 404.
    throw router.errors.NOT_FOUND
  }

  let activeIndex = publicClasses.indexOf(activePublicClass)
  let previousClass = activeIndex > 0 ? publicClasses[activeIndex - 1] : null
  let nextClass =
    activeIndex < publicClasses.length - 1
      ? publicClasses[activeIndex + 1]
      : null

  let previousPage = previousClass
    ? {
        url: router
          .routerFor("/api/classes/:classSlug")
          .buildUrl({ classSlug: previousClass.slug }),
        label: previousClass.name,
      }
    : null
  let nextPage = nextClass
    ? {
        url: router
          .routerFor("/api/classes/:classSlug")
          .buildUrl({ classSlug: nextClass.slug }),
        label: nextClass.name,
      }
    : null

  return (
    <>
      <SEO title={activePublicClass?.name} />

      <ThreeColumnLayout
        menuItems={menuItems}
        previousPage={previousPage}
        nextPage={nextPage}
      >
        {props.children}
      </ThreeColumnLayout>
    </>
  )
}
