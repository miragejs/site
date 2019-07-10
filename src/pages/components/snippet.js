import React from "react"
import "./snippet.css"
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

  return (
    <div className="-mx-5" dangerouslySetInnerHTML={{ __html: snippet.html }} />
  )
}

// import React from "react"
// import { useStaticQuery, graphql } from "gatsby"
// import Prism from "prismjs"
//
// export default function Snippet({ name }) {
//   const data = useStaticQuery(graphql`
//     query SnippetsQuery {
//       allFile(filter: { absolutePath: { regex: "/snippets/" } }) {
//         nodes {
//           absolutePath
//           fields {
//             content
//           }
//           name
//           relativePath
//         }
//       }
//     }
//   `)
//   let snippets = data.allFile.nodes.map(node => ({
//     name: node.name,
//     content: node.fields.content,
//   }))
//
//   let snippet = snippets.find(snippet => snippet.name === name).content
//
//   // Remove ``` backticks
//   snippet = snippet.substring(snippet.indexOf("\n") + 1)
//   snippet = snippet.substring(snippet.lastIndexOf("\n") - 3, -1)
//
//   let html = Prism.highlight(snippet, Prism.languages.javascript, "javascript")
//
//   return (
//     <div className="-mx-5">
//       <pre
//         data-line="4-12"
//         className="text-sm bg-gray-900 py-4 px-5 border-gray-500 max-w-full overflow-scroll scrolling-touch"
//       >
//         <code dangerouslySetInnerHTML={{ __html: html }} />
//       </pre>
//     </div>
//   )
// }
