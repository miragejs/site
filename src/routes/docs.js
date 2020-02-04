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

  let routesContent = transform(data.allMdx.nodes)
  let docsRouter = router.routerFor("/docs")
  let { heading } = routesContent[router.activePage.fullName]

  return (
    <>
      <SEO title={heading} />

      <ThreeColumnLayout
        routes={docsRouter.routes}
        routesContent={routesContent}
        previousPage={docsRouter.previousPage}
        nextPage={docsRouter.nextPage}
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
    let [, path] = node.fileAbsolutePath.match(/(docs\/.+)\.md[x]?/)
    let routeFullName = path.replace(/\//g, ".")

    memo[routeFullName] = {
      heading: node.headings[0].value,
      tableOfContents: node.tableOfContents.items[0].items || [],
    }
    return memo
  }, {})
}
