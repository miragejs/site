import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"
import { useStaticQuery, graphql } from "gatsby"
import SEO from "../components/seo"

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

  let routesContent = transform(data.allMdx.nodes)
  let quickstartsRouter = router.routerFor("/quickstarts")
  let { heading } = routesContent[router.activePage.fullName]

  return (
    <>
      <SEO title={heading} />

      <ThreeColumnLayout
        routes={quickstartsRouter.routes}
        routesContent={routesContent}
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

/**
 * This function takes in the raw array of nodes from the above graphql query,
 * and turns it into an object whose keys match the fullName identifiers from
 * our router, and whose values are the extracted data from the query:
 *
 *   routesContent = {
 *     'docs.getting-started.overview': {
 *       heading: 'Overview',
 *       tableOfContents: [ { url: '...', title: '...' }, ...]
 *     },
 *     ...
 *   }
 */
function transform(nodes) {
  return nodes.reduce((memo, node) => {
    let [, path] = node.fileAbsolutePath.match(/(quickstarts\/.+)\.md[x]?/)
    let routeFullName = path.replace(/\//g, ".")

    memo[routeFullName] = {
      heading: node.headings[0].value,
      tableOfContents: node.tableOfContents.items[0].items || [],
    }
    return memo
  }, {})
}
