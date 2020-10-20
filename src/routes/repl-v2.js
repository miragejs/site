import React, { useState } from "react"
import { useQuery } from "urql"
import Repl from "../components/repl"
import SEO from "../components/seo"
import { nanoid, customAlphabet } from "nanoid"
import { useSandbox } from "../hooks/use-sandbox"

const shortNanoid = customAlphabet("1234567890abcdef", 10)

export default function ({ id2, navigate, location }) {
  let [buffer, setBuffer] = useState(location.state?.sandbox)
  /*
    If we navigated here from /repl with location state, we use that as the
    default values for the buffer then clear it using navigate(). This
    lets us avoid waiting on loading the sandbox from the server.
  */
  if (location.state?.sandbox) {
    navigate(location.pathname, { replace: true, state: {} })
  }

  let [res] = useQuery({
    query: `
      query ($id2: String!) {
        sandboxes(where: {id2: {_eq: $id2}}) {
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
      id2,
    },
  })

  let sandboxFromServer
  let serverResponse = res.data?.sandboxes[0]
  let serverDataMatchesUrlParam = serverResponse?.id2 === id2
  if (serverResponse && serverDataMatchesUrlParam) {
    let { __typename, ...rest } = serverResponse
    sandboxFromServer = rest
  }

  if (!buffer && sandboxFromServer) {
    setBuffer(sandboxFromServer)
  }

  /*
    If we already have a buffer and sandboxFromServer changes (e.g. due to a navigation),
    the buffer gets stale. So we update it.
  */
  if (buffer && sandboxFromServer && buffer.id !== sandboxFromServer.id) {
    setBuffer(sandboxFromServer)
  }

  let { createSandbox, updateSandbox } = useSandbox()

  function handleSave() {
    if (
      buffer.browser_id &&
      buffer.browser_id === localStorage.getItem("repl:browserId")
    ) {
      handleUpdateSandbox()
    } else {
      handleCreateSandbox()
    }
  }

  function handleUpdateSandbox() {
    localStorage.getItem("repl:editingToken")
    let { id, id2, browser_id, ...sandboxAttrs } = buffer

    updateSandbox({ id, object: sandboxAttrs })
  }

  function handleCreateSandbox() {
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
      navigate(`/repl/v2/${res.data.insert_sandboxes_one.id2}`)
    })
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

  return (
    <>
      <SEO title={`REPL ${id2}`} />

      {!buffer ? (
        <div
          className="flex flex-col items-center mt-16"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <p className="mt-40 text-xl text-gray-500 animate-pulse">
            Loading...
          </p>
        </div>
      ) : (
        <Repl
          hasChanges={bufferHasChanges}
          onSave={handleSave}
          sandbox={buffer}
          setSandbox={setBuffer}
        />
      )}
    </>
  )
}
