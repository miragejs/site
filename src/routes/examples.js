import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"

export default function ExamplesPage(props) {
  let router = useRouter()

  let docsRouter = router.routerFor("/examples")

  let data = useStaticQuery(graphql`
    query OnThisExamplePage {
      allMdx {
        nodes {
          tableOfContents
          fileAbsolutePath
        }
      }
    }
  `)

  let mdxPage = data.allMdx.nodes.find(node => {
    let didMatch = false
    let match = node.fileAbsolutePath.match(/(\/examples\/.+)\.md[x]?/)

    if (match) {
      let regexp = new RegExp(`${match[1]}/?`)
      didMatch = match && regexp.test(props.location.pathname)
    }

    return didMatch
  })

  let tableOfContentsItems = mdxPage && mdxPage.tableOfContents.items[0].items

  return (
    <ThreeColumnLayout
      routes={docsRouter.routes}
      previousPage={docsRouter.previousPage}
      nextPage={docsRouter.nextPage}
      currentPageTableOfContentsItems={tableOfContentsItems}
    >
      {props.children}
    </ThreeColumnLayout>
  )
}
