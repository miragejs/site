import React, { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Repl from "../components/repl"
import queryString from "query-string"
import { useMutation } from "urql"
import { nanoid, customAlphabet } from "nanoid"

const shortNanoid = customAlphabet("1234567890abcdef", 10)

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

  // Clear any query params from initial render
  useEffect(() => {
    if (location.search) {
      navigate("/repl")
    }
  })

  const { createSandbox } = useSandbox()

  function handleSave() {
    let editingToken = nanoid()
    let browserId = shortNanoid()

    localStorage.setItem("repl:editingToken", editingToken)
    localStorage.setItem("repl:browserId", browserId)

    let attrs = {
      id2: shortNanoid(),
      editing_token: editingToken,
      browser_id: browserId,
      config: configInput,
      method,
      url,
      request_body: requestBody,
    }

    createSandbox({ object: attrs }).then((res) => {
      let id2 = res.data.insert_sandboxes_one.id2
      navigate(`/repl/v2/${id2}`)
    })
  }

  return (
    <Repl
      onSave={handleSave}
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

function useSandbox() {
  const CreateSandbox = `
    mutation ($object: sandboxes_insert_input!) {
      insert_sandboxes_one(object: $object) {
        id2
      }
    }
  `
  const [, createSandbox] = useMutation(CreateSandbox)

  return { createSandbox }
}
