import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Code from "./code"

export default function Snippet({ name, backgroundColor }) {
  const data = useStaticQuery(graphql`
    query SnippetsQuery {
      allFile(filter: { absolutePath: { regex: "/snippets/" } }) {
        nodes {
          name
          fields {
            content
          }
        }
      }
    }
  `)
  let snippets = data.allFile.nodes.map((node) => ({
    name: node.name,
    body: node.fields.content,
  }))
  let snippet = snippets.find((snippet) => snippet.name === name)
  let lines = snippet.body.split("\n")
  let codeblockArgs = lines.shift()
  let props = {}
  if (backgroundColor) {
    props.backgroundColor = backgroundColor
  }
  let matchLanguage = codeblockArgs.match(/```([^{]+)/)
  if (matchLanguage) {
    props.language = matchLanguage[1]
  }
  let matchHighlightedLines = codeblockArgs.match(/{(.+)}/)
  if (matchHighlightedLines) {
    props.highlightedLines = matchHighlightedLines[1]
  }
  let indexClosingTicks = lines.indexOf("```")
  lines = lines.filter((line, index) => index < indexClosingTicks)
  return <Code {...props}>{lines.join("\n")}</Code>
}
