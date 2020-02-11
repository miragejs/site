import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"
import { useStaticQuery, graphql } from "gatsby"
import SEO from "../components/seo"
import { urlsMatch } from "../utils"

export default function QuickstartsPage(props) {
  const data = useStaticQuery(graphql`
    query {
      allMdx(filter: { fileAbsolutePath: { regex: "/routes/quickstarts/" } }) {
        nodes {
          tableOfContents
          fileAbsolutePath
          headings(depth: h1) {
            value
          }
        }
      }
    }
  `)
  let router = useRouter()

  // we're rendering the docs component but there's no route, that means the
  // use is requesting a detail/docs page that doesnt exist!
  if (!router.activeRoute) {
    throw router.errors.NOT_FOUND
  }

  let quickstartsRouter = router.routerFor("/quickstarts")
  let menuItems = transform(data.allMdx.nodes, quickstartsRouter)
  let heading = getActiveHeading(data.allMdx.nodes, router.activePath)

  return (
    <>
      <SEO title={heading} />

      <ThreeColumnLayout
        menuItems={menuItems}
        previousPage={
          quickstartsRouter.previousPage &&
          router.activePage.parent === quickstartsRouter.previousPage.parent
            ? quickstartsRouter.previousPage
            : null
        }
        nextPage={
          quickstartsRouter.nextPage &&
          router.activePage.parent === quickstartsRouter.nextPage.parent
            ? quickstartsRouter.nextPage
            : null
        }
      >
        {props.children}
      </ThreeColumnLayout>
    </>
  )
}

function transform(nodes, router) {
  return addHeadings(nodes, transformRoutes(router))
}

function transformRoutes(router) {
  let menuItemsNoHeadings = router.routes.map(route => {
    let obj = { label: route.label }

    if (route.isPage) {
      obj.url = route.url
    } else {
      obj.links = transformRoutes(route)
    }

    return obj
  })

  return menuItemsNoHeadings
}

function addHeadings(nodes, menuItemsNoHeadings) {
  return menuItemsNoHeadings.reduce((array, originalItem) => {
    let item = { ...originalItem }
    if (item.url) {
      let matchedNode = nodes.find(node => {
        let [, path] = node.fileAbsolutePath.match(
          /(\/quickstarts\/.+)\.md[x]?/
        )

        return urlsMatch(item.url, path)
      })

      let headings = matchedNode.tableOfContents.items[0].items
      if (headings && headings.length > 0) {
        item.headings = headings.map(heading => ({
          anchor: heading.url,
          label: heading.title,
        }))
      }
    } else if (item.links) {
      item.links = addHeadings(nodes, item.links)
    }

    return [...array, item]
  }, [])
}

function getActiveHeading(nodes, activePath) {
  let nodeForActivePath = nodes.find(node => {
    let [, path] = node.fileAbsolutePath.match(/(\/quickstarts\/.+)\.md[x]?/)

    return urlsMatch(activePath, path)
  })

  return nodeForActivePath.tableOfContents.items[0].title
}
