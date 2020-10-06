import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Repl from "../components/repl"
import queryString from "query-string"

function getInitialValues({ location, defaultConfig }) {
  let queryParams = queryString.parse(location.search) ?? {}
  let mode =
    queryParams.config ||
    queryParams.method ||
    queryParams.url ||
    queryParams.body
      ? "queryParams"
      : "default"

  let initialValues = {
    default: {
      configInput: defaultConfig,
      method: "GET",
      url: "/api/movies",
      requestBody: "",
    },
    queryParams: {
      configInput: queryParams.config
        ? atob(queryParams.config)
        : defaultConfig,
      method: queryParams.method || "GET",
      url: queryParams.url || "",
      requestBody: queryParams.body || "",
    },
  }

  return initialValues[mode]
}

export default function ({ location, navigate }) {
  let defaultConfig = useTutorialSnippet("starting-input")
  let initialValues = getInitialValues({ location, defaultConfig })
  let [configInput, setConfigInput] = useState(initialValues.configInput)
  let [method, setMethod] = useState(initialValues.method)
  let [url, setUrl] = useState(initialValues.url)
  let [requestBody, setRequestBody] = useState(initialValues.requestBody)

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
