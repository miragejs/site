import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ThreeColumnLayout } from "../components/three-column-layout"
import { useRouter } from "../hooks/use-router"

import useApiDocs from "../hooks/use-api-docs"

export default function DocsPage(props) {
  let router = useRouter()

  const data = useStaticQuery(graphql`
    query OnThisPageQuery {
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
    let match = node.fileAbsolutePath.match(/(\/docs\/.+)\.md[x]?/)

    if (match) {
      let regexp = new RegExp(`${match[1]}/?`)
      didMatch = match && regexp.test(props.location.pathname)
    }

    return didMatch
  })
  let tableOfContentsItems = mdxPage && mdxPage.tableOfContents.items[0].items

  // let { publicClasses } = useApiDocs()

  return (
    <ThreeColumnLayout
      router={router.routerFor("/docs")}
      currentPageTableOfContentsItems={tableOfContentsItems}
    >
      {props.children}
    </ThreeColumnLayout>
  )
}
