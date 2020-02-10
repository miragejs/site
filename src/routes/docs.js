import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"
import SEO from "../components/seo"

export default function DocsPage(props) {
  const data = useStaticQuery(graphql`
    query OnThisPageQuery {
      allMdx(filter: { fileAbsolutePath: { regex: "/routes/docs/" } }) {
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

  let docsRouter = router.routerFor("/docs")
  let menuItems = transform(data.allMdx.nodes, docsRouter)

  // let { heading } = routesContent[router.activePage.fullName]

  return (
    <>
      {/* <SEO title={heading} /> */}

      <ThreeColumnLayout
        routes={docsRouter.routes}
        menuItems={menuItems}
        previousPage={docsRouter.previousPage}
        nextPage={docsRouter.nextPage}
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
      obj.url = route.fullPath
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
        let [, path] = node.fileAbsolutePath.match(/(\/docs\/.+)\.md[x]?/)

        return item.url === path
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
