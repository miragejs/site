import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Prism from "prismjs"

export default function Snippet({ name }) {
  const data = useStaticQuery(graphql`
    query SnippetsQuery {
      allFile(filter: { absolutePath: { regex: "/snippets/" } }) {
        nodes {
          absolutePath
          fields {
            content
          }
          name
          relativePath
        }
      }
    }
  `)
  let snippets = data.allFile.nodes.map(node => ({
    name: node.name,
    content: node.fields.content,
  }))
  let html = Prism.highlight(
    snippets[0].content,
    Prism.languages.javascript,
    "javascript"
  )

  return (
    <pre
      className="text-xs bg-gray-dark py-4 px-3  rounded border-gray-light max-w-full overflow-scroll scrolling-touch"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
