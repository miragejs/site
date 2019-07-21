import React from "react"
import "./style.css"
import { useStaticQuery, graphql } from "gatsby"

export default function Snippet({ name }) {
  const data = useStaticQuery(graphql`
    query SnippetsQuery {
      allFile(filter: { absolutePath: { regex: "/snippets/" } }) {
        nodes {
          name
          childMarkdownRemark {
            html
          }
        }
      }
    }
  `)
  let snippets = data.allFile.nodes.map(node => ({
    name: node.name,
    html: node.childMarkdownRemark.html,
  }))

  let snippet = snippets.find(snippet => snippet.name === name)

  return <div dangerouslySetInnerHTML={{ __html: snippet.html }} />
}
