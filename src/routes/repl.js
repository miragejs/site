import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Repl from "../components/repl"
import queryString from "query-string"
import { useLocation } from "@reach/router"

function DefaultSandbox() {
  let defaultConfig = useTutorialSnippet("starting-input")

  let [configInput, setConfigInput] = useState(defaultConfig)
  let [method, setMethod] = useState("GET")
  let [url, setUrl] = useState("/api/movies")
  let [requestBody, setRequestBody] = useState("")

  return (
    <Repl
      setConfigInput={setConfigInput}
      configInput={configInput}
      method={method}
      setMethod={setMethod}
      url={url}
      setUrl={setUrl}
      requestBody={requestBody}
      setRequestBody={setRequestBody}
    />
  )
}

function QueryParamsSandbox() {
  let defaultConfig = useTutorialSnippet("starting-input")
  let location = useLocation()
  let queryParams = queryString.parse(location.search) ?? {}

  let [configInput, setConfigInput] = useState(
    queryParams.config ? atob(queryParams.config) : defaultConfig
  )
  let [method, setMethod] = useState(queryParams.method || "GET")
  let [url, setUrl] = useState(queryParams.url || "")
  let [requestBody, setRequestBody] = useState(queryParams.body || "")

  return (
    <Repl
      setConfigInput={setConfigInput}
      configInput={configInput}
      method={method}
      setMethod={setMethod}
      url={url}
      setUrl={setUrl}
      requestBody={requestBody}
      setRequestBody={setRequestBody}
    />
  )
}

export default function ({ location, navigate }) {
  let queryParams = queryString.parse(location.search) ?? {}
  let Component =
    queryParams.config ||
    queryParams.method ||
    queryParams.url ||
    queryParams.body
      ? QueryParamsSandbox
      : DefaultSandbox

  return <Component />
}

function useTutorialSnippet(name) {
  const data = useStaticQuery(graphql`
    query {
      allFile(
        filter: { absolutePath: { regex: "/tutorial-assets/snippets/" } }
      ) {
        nodes {
          name
          fields {
            content
          }
        }
      }
    }
  `)
  let snippets = data.allFile.nodes.reduce((memo, node) => {
    let [, ...lines] = node.fields.content.split("\n")
    let indexClosingTicks = lines.indexOf("```")
    lines = lines.filter((line, index) => index < indexClosingTicks)

    memo[node.name] = lines.join("\n")

    return memo
  }, {})

  return snippets[name]
}
