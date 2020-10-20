import React, { useState } from "react"
import { useQuery } from "urql"
import SEO from "../components/seo"
import Repl from "../components/repl"
import { nanoid, customAlphabet } from "nanoid"
import { useSandbox } from "../hooks/use-sandbox"
import { Link } from "gatsby"

const shortNanoid = customAlphabet("1234567890abcdef", 10)

export default function ({ id, navigate }) {
  let [buffer, setBuffer] = useState()

  const [res] = useQuery({
    query: `
      query ($id: Int!) {
        sandboxes_by_pk(id: $id) {
          id
          id2
          config
          method
          request_body
          url
          browser_id
        }
      }
    `,
    variables: {
      id: +id,
    },
  })

  let sandboxFromServer
  let serverResponse = res.data?.sandboxes_by_pk
  let serverDataMatchesUrlParam = serverResponse?.id === +id
  if (serverResponse && serverDataMatchesUrlParam) {
    let { __typename, ...rest } = serverResponse
    sandboxFromServer = rest
  }

  if (!buffer && sandboxFromServer) {
    setBuffer(sandboxFromServer)
  }

  let bufferHasChanges
  if (sandboxFromServer && buffer) {
    let configHasChanged = sandboxFromServer.config !== buffer.config
    let methodHasChanged = sandboxFromServer.method !== buffer.method
    let urlHasChanged = sandboxFromServer.url !== buffer.url
    let requestBodyHasChanged =
      sandboxFromServer.requestBody !== buffer.requestBody

    bufferHasChanges =
      configHasChanged ||
      methodHasChanged ||
      urlHasChanged ||
      requestBodyHasChanged
  }

  let { createSandbox } = useSandbox()

  function handleSave() {
    let editingToken = localStorage.getItem("repl:editingToken") || nanoid()
    let browserId = localStorage.getItem("repl:browserId") || shortNanoid()

    localStorage.setItem("repl:editingToken", editingToken)
    localStorage.setItem("repl:browserId", browserId)

    let { id, ...newSandboxAttrs } = buffer
    let attrs = {
      ...newSandboxAttrs,
      id2: shortNanoid(),
      editing_token: editingToken,
      browser_id: browserId,
    }

    createSandbox({ object: attrs }).then((res) => {
      let { __typename, ...newSandbox } = res.data.insert_sandboxes_one
      navigate(`/repl/v2/${newSandbox.id2}`, { state: { sandbox: newSandbox } })
    })
  }

  return res.error || res.data?.sandboxes_by_pk === null ? (
    <div
      className="flex flex-col items-center mt-16"
      style={{ height: "calc(100vh - 4rem)" }}
      data-testid="missing-sandbox"
    >
      <p className="mt-40 text-xl text-gray-700">
        REPL not found.{" "}
        <span role="img" aria-label="sad face">
          😕
        </span>
      </p>
      <p className="mt-12 text-gray-500">
        Try{" "}
        <Link className="text-blue-500 underline" to="/repl">
          creating a new REPL
        </Link>
        .
      </p>
    </div>
  ) : !buffer ? (
    <div
      className="flex flex-col items-center mt-16"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <p className="mt-40 text-xl text-gray-500 animate-pulse">Loading...</p>
    </div>
  ) : (
    <>
      <SEO title={`REPL ${id}`} />

      <Repl
        hasChanges={bufferHasChanges}
        onSave={handleSave}
        sandbox={buffer}
        setSandbox={setBuffer}
      />
    </>
  )
  // if (res.error || res.data?.sandboxes_by_pk === null) {
  //   return (
  //     <div className="flex flex-col items-center justify-center flex-1">
  //       REPL not found.
  //     </div>
  //   )
  // } else if (!initialSandbox) {
  //   return (
  //     <div className="flex flex-col items-center justify-center flex-1">
  //       <div>Loading REPL...</div>
  //     </div>
  //   )
  // } else
}
