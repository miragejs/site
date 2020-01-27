import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"
import SEO from "../components/seo"

export default function DocsPage(props) {
  let router = useRouter()

  const data = useStaticQuery(graphql`
    query OnThisPageQuery {
      allMdx {
        nodes {
          tableOfContents
          fileAbsolutePath
          headings {
            depth
            value
          }
        }
      }
    }
  `)
  let mdxPage = data.allMdx.nodes.find(node => {
    let didMatch = false
    let match = node.fileAbsolutePath.match(/(\/docs\/.+)\.md[x]?/)

    if (match) {
      let regexp = new RegExp(`${match[1]}/?`)
      didMatch = match && regexp.test(props.location.pathname)
    }

    return didMatch
  })
  let tableOfContentsItems = mdxPage && mdxPage.tableOfContents.items[0].items

  let docsRouter = router.routerFor("/docs")

  let heading = mdxPage.headings.find(heading => heading.depth === 1)
  let title = heading && heading.value

  return (
    <>
      {title && <SEO title={title} />}
      <ThreeColumnLayout
        routes={docsRouter.routes}
        previousPage={docsRouter.previousPage}
        nextPage={docsRouter.nextPage}
        currentPageTableOfContentsItems={tableOfContentsItems}
      >
        {props.children}
      </ThreeColumnLayout>
    </>
  )
}
