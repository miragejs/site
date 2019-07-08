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

  let snippet = snippets.find(snippet => snippet.name === name).content

  // Remove ``` backticks
  snippet = snippet.substring(snippet.indexOf("\n") + 1)
  snippet = snippet.substring(snippet.lastIndexOf("\n") - 3, -1)

  let html = Prism.highlight(snippet, Prism.languages.javascript, "javascript")

  return (
    <pre
      className="text-xs bg-gray-dark py-4 px-3  rounded border-gray-light max-w-full overflow-scroll scrolling-touch"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
