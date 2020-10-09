import React, { useRef, useState } from "react"
import { useQuery } from "urql"
import Repl from "../components/repl"
import { useMutation } from "urql"
import { nanoid, customAlphabet } from "nanoid"

const shortNanoid = customAlphabet("1234567890abcdef", 10)

export default function ({ id2, navigate }) {
  let hasSetInitialStateRef = useRef(false)
  let [initialConfigInput, setInitialConfigInput] = useState()
  let [configInput, setConfigInput] = useState("")
  let [method, setMethod] = useState("")
  let [url, setUrl] = useState("")
  let [requestBody, setRequestBody] = useState("")
  let [res] = useQuery({
    query: `
      query ($id2: String!) {
        sandboxes(where: {id2: {_eq: $id2}}) {
          id
          config
          method
          request_body
          url
        }
      }
    `,
    variables: {
      id2,
    },
  })

  let sandbox = res.data?.sandboxes[0]

  if (!hasSetInitialStateRef.current && sandbox) {
    setInitialConfigInput(sandbox.config || "")
    setConfigInput(sandbox.config || "")
    setMethod(sandbox.method || "GET")
    setUrl(sandbox.url || "")
    setRequestBody(sandbox.request_body || "")

    hasSetInitialStateRef.current = true
  }

  let hasChanges = initialConfigInput !== configInput

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
      let newSandbox = res.data.insert_sandboxes_one
      setInitialConfigInput(newSandbox.config || "")
      navigate(`/repl/v2/${newSandbox.id2}`)
    })
  }

  return !hasSetInitialStateRef.current ? (
    <p>Loading...</p>
  ) : (
    <Repl
      hasChanges={hasChanges}
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

function useSandbox() {
  const CreateSandbox = `
    mutation ($object: sandboxes_insert_input!) {
      insert_sandboxes_one(object: $object) {
        id
        id2
        config
        method
        request_body
        url
      }
    }
  `
  const [, createSandbox] = useMutation(CreateSandbox)

  return { createSandbox }
}
