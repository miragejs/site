import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"
import { useStaticQuery, graphql } from "gatsby"
import SEO from "../components/seo"

export default function QuickstartsPage(props) {
  let router = useRouter()
  let docsRouter = router.routerFor("/quickstarts")

  const data = useStaticQuery(graphql`
    query {
      allMdx(filter: { fileAbsolutePath: { regex: "/routes/quickstarts/" } }) {
        nodes {
          tableOfContents
          headings(depth: h1) {
            value
          }
          fileAbsolutePath
        }
      }
    }
  `)
  let mdxPage = data.allMdx.nodes.find(node => {
    let didMatch = false
    let match = node.fileAbsolutePath.match(/(\/quickstarts\/.+)\.md[x]?/)

    if (match) {
      let regexp = new RegExp(`${match[1]}/?`)
      didMatch = match && regexp.test(props.location.pathname)
    }

    return didMatch
  })
  let title = mdxPage?.headings[0]?.value

  return (
    <>
      {title && <SEO title={title} />}
      <ThreeColumnLayout
        routes={docsRouter.routes}
        previousPage={
          docsRouter.previousPage &&
          router.activePage.parent === docsRouter.previousPage.parent
            ? docsRouter.previousPage
            : null
        }
        nextPage={
          docsRouter.nextPage &&
          router.activePage.parent === docsRouter.nextPage.parent
            ? docsRouter.nextPage
            : null
        }
      >
        {props.children}
      </ThreeColumnLayout>
    </>
  )
}
