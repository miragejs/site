import React, { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Repl from "../components/repl"
import queryString from "query-string"
import { nanoid, customAlphabet } from "nanoid"
import { useSandbox } from "../hooks/use-sandbox"

const shortNanoid = customAlphabet("1234567890abcdef", 10)

function getInitialSandbox({ location, defaultConfig }) {
  let queryParams = queryString.parse(location.search) ?? {}
  let mode =
    queryParams.config ||
    queryParams.method ||
    queryParams.url ||
    queryParams.body
      ? "queryParams"
      : "default"

  let initialSandboxes = {
    default: {
      config: defaultConfig,
      method: "GET",
      url: "/api/movies",
      request_body: "",
    },
    queryParams: {
      config: queryParams.config ? atob(queryParams.config) : defaultConfig,
      method: queryParams.method || "GET",
      url: queryParams.url || "",
      request_body: queryParams.body || "",
    },
  }

  return initialSandboxes[mode]
}

export default function ({ location, navigate }) {
  let defaultConfig = useTutorialSnippet("starting-input")
  let initialSandbox = getInitialSandbox({ location, defaultConfig })
  let [buffer, setBuffer] = useState(initialSandbox)

  // Clear any query params from initial render
  useEffect(() => {
    if (location.search) {
      navigate("/repl")
    }
  })

  const { createSandbox } = useSandbox()

  function handleSave() {
    let editingToken = localStorage.getItem("repl:editingToken") || nanoid()
    let browserId = localStorage.getItem("repl:browserId") || shortNanoid()

    localStorage.setItem("repl:editingToken", editingToken)
    localStorage.setItem("repl:browserId", browserId)

    let attrs = {
      id2: shortNanoid(),
      editing_token: editingToken,
      browser_id: browserId,
      ...buffer,
    }

    createSandbox({ object: attrs }).then((res) => {
      let { __typename, ...newSandbox } = res.data.insert_sandboxes_one
      navigate(`/repl/v2/${newSandbox.id2}`, { state: { sandbox: newSandbox } })
    })
  }

  let configHasChanged = initialSandbox.config !== buffer.config
  let methodHasChanged = initialSandbox.method !== buffer.method
  let urlHasChanged = initialSandbox.url !== buffer.url
  let requestBodyHasChanged = initialSandbox.requestBody !== buffer.requestBody

  let hasChanges =
    configHasChanged ||
    methodHasChanged ||
    urlHasChanged ||
    requestBodyHasChanged

  return (
    <Repl
      onSave={handleSave}
      sandbox={buffer}
      setSandbox={setBuffer}
      hasChanges={hasChanges}
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
