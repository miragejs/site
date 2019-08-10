import React from "react"
import { useStaticQuery, graphql } from "gatsby"

/*
  This component uses childMarkdownRemark, because it supports line highlighting.

  It'd be nice to figure out how to get it to use our <Code> component.
*/
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
