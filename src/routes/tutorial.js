import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"
import SEO from "../components/seo"
import { urlsMatch } from "../utils"

export default function TutorialPage(props) {
  const data = useStaticQuery(graphql`
    query {
      allMdx(filter: { fileAbsolutePath: { regex: "/routes/tutorial/" } }) {
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

  // we're rendering the tutorial component but there's no route, that means the
  // use is requesting a detail/tutorial page that doesnt exist!
  if (!router.activeRoute) {
    throw router.errors.NOT_FOUND
  }

  let tutorialRouter = router.routerFor("/tutorial")
  let menuItems = transform(data.allMdx.nodes, tutorialRouter)
  let heading = getActiveHeading(data.allMdx.nodes, router.activeUrl)

  return (
    <>
      <SEO title={heading} />

      <ThreeColumnLayout
        BeforeNav={() => (
          <div className="pb-4 -mt-4">
            <p className="rounded px-6 py-2 text-xs font-medium text-gray-900 bg-yellow-300">
              This tutorial is a work in progress.
            </p>
          </div>
        )}
        menuItems={menuItems}
        previousPage={tutorialRouter.previousPage}
        nextPage={tutorialRouter.nextPage}
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
  let menuItemsNoHeadings = router.routes.map((route) => {
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
      let matchedNode = nodes.find((node) => {
        let [, path] = node.fileAbsolutePath.match(/(\/tutorial\/.+)\.md[x]?/)

        return urlsMatch(item.url, path)
      })

      let headings = matchedNode.tableOfContents.items[0].items
      if (headings && headings.length > 0) {
        item.headings = headings.map((heading) => ({
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

function getActiveHeading(nodes, activeUrl) {
  let nodeForActiveUrl = nodes.find((node) => {
    let [, path] = node.fileAbsolutePath.match(/(\/tutorial\/.+)\.md[x]?/)

    return urlsMatch(activeUrl, path)
  })

  return nodeForActiveUrl.tableOfContents.items[0].title
}
