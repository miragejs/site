import React, { useState } from "react"
import { useQuery } from "urql"
import Repl from "../components/repl"
import SEO from "../components/seo"
import { nanoid, customAlphabet } from "nanoid"
import { useSandbox } from "../hooks/use-sandbox"

const shortNanoid = customAlphabet("1234567890abcdef", 10)

export default function ({ id2, navigate, location }) {
  /*
    If we navigated here from /repl with location state, use that as the
    default values for this state, then clear it using navigate(). This
    lets us avoid waiting on urql to load the sandbox from the server.
    TODO
  */
  // let [initialSandbox, setInitialSandbox] = useState(location.state?.sandbox)
  // let [buffer, setBuffer] = useState(location.state?.sandbox)
  let [buffer, setBuffer] = useState()
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
    If we already have a buffer and we navigate from one sandbox to another, our buffer
    gets stale. So we update it.

    This happens after a sandbox is either created from /repl or forked from /repl/v2.
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

  let hasChanges
  if (sandboxFromServer && buffer) {
    let configHasChanged = sandboxFromServer.config !== buffer.config
    let methodHasChanged = sandboxFromServer.method !== buffer.method
    let urlHasChanged = sandboxFromServer.url !== buffer.url
    let requestBodyHasChanged =
      sandboxFromServer.requestBody !== buffer.requestBody

    hasChanges =
      configHasChanged ||
      methodHasChanged ||
      urlHasChanged ||
      requestBodyHasChanged
  }

  return (
    <>
      <SEO title={`REPL ${id2}`} />

      {!buffer ? (
        <p>Loading...</p>
      ) : (
        <Repl
          hasChanges={hasChanges}
          onSave={handleSave}
          sandbox={buffer}
          setSandbox={setBuffer}
        />
      )}
    </>
  )
}
