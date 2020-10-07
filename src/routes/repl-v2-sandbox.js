import React, { useRef, useState } from "react"
import { useQuery } from "urql"
import Repl from "../components/repl"

export default function ({ id2 }) {
  let hasSetInitialStateRef = useRef(false)
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

  if (res.fetching) return <p>Loading...</p>

  let sandbox = res.data?.sandboxes[0]

  if (!hasSetInitialStateRef.current && sandbox) {
    setConfigInput(sandbox.config || "")
    setMethod(sandbox.method || "GET")
    setUrl(sandbox.url || "")
    setRequestBody(sandbox.request_body || "")

    hasSetInitialStateRef.current = true
  }

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

  // // Redirect if we find a Sandbox
  // if (res.data?.sandboxes_by_pk) {
  //   let { config, method, request_body, url } = res.data.sandboxes_by_pk
  //   let params = { config: btoa(config), method, url, body: request_body }
  //   let search = queryString.stringify(params)
  //   navigate(`/repl?${search}`)
  // }

  // if (res.error || res.data?.sandboxes_by_pk === null) {
  //   return (
  //     <div className="flex flex-col items-center justify-center flex-1">
  //       REPL not found.
  //     </div>
  //   )
  // } else {
  //   return (
  //     <div className="flex flex-col items-center justify-center flex-1">
  //       <div>Loading REPL...</div>
  //     </div>
  //   )
  // }
}
