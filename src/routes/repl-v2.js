import React, { useEffect, useState } from "react"
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
  */
  let [initialSandbox, setInitialSandbox] = useState(location.state?.sandbox)
  let [sandbox, setSandbox] = useState(location.state?.sandbox)
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

  let hasntSetInitialSandbox = !initialSandbox && res.data

  if (hasntSetInitialSandbox) {
    let { __typename, ...sandboxFromResponse } = res.data.sandboxes[0]
    setInitialSandbox(sandboxFromResponse)
    setSandbox(sandboxFromResponse)
  }

  /*
    If the user navigated from one v2 sandbox directly to another (e.g. by using
    the back button to jump between them) we need to reset our sandbox state.
  */
  let hasNavigatedToNewSandbox = initialSandbox && initialSandbox.id2 !== id2
  useEffect(() => {
    if (hasNavigatedToNewSandbox && !res.fetching) {
      setInitialSandbox(null)
    }
  }, [hasNavigatedToNewSandbox, res.fetching])

  let { createSandbox, updateSandbox } = useSandbox()

  function handleSave() {
    if (
      sandbox.browser_id &&
      sandbox.browser_id === localStorage.getItem("repl:browserId")
    ) {
      handleUpdateSandbox()
    } else {
      handleCreateSandbox()
    }
  }

  function handleUpdateSandbox() {
    localStorage.getItem("repl:editingToken")
    let { id, id2, browser_id, ...sandboxAttrs } = sandbox

    updateSandbox({ id, object: sandboxAttrs }).then((res) => {
      let {
        __typename,
        ...sandboxFromResponse
      } = res.data.update_sandboxes_by_pk
      setInitialSandbox(sandboxFromResponse)
    })
  }

  function handleCreateSandbox() {
    let editingToken = localStorage.getItem("repl:editingToken") || nanoid()
    let browserId = localStorage.getItem("repl:browserId") || shortNanoid()

    localStorage.setItem("repl:editingToken", editingToken)
    localStorage.setItem("repl:browserId", browserId)

    let { id, ...newSandboxAttrs } = sandbox
    let attrs = {
      ...newSandboxAttrs,
      id2: shortNanoid(),
      editing_token: editingToken,
      browser_id: browserId,
    }

    createSandbox({ object: attrs }).then((res) => {
      let { __typename, ...newSandbox } = res.data.insert_sandboxes_one
      setSandbox(newSandbox)
      setInitialSandbox(newSandbox)
      navigate(`/repl/v2/${newSandbox.id2}`)
    })
  }

  let hasChanges
  if (initialSandbox) {
    let configHasChanged = initialSandbox.config !== sandbox.config
    let methodHasChanged = initialSandbox.method !== sandbox.method
    let urlHasChanged = initialSandbox.url !== sandbox.url
    let requestBodyHasChanged =
      initialSandbox.requestBody !== sandbox.requestBody

    hasChanges =
      configHasChanged ||
      methodHasChanged ||
      urlHasChanged ||
      requestBodyHasChanged
  }

  return (
    <>
      <SEO title={`REPL ${id2}`} />

      {!initialSandbox ? (
        <p>Loading...</p>
      ) : (
        <Repl
          hasChanges={hasChanges}
          onSave={handleSave}
          sandbox={sandbox}
          setSandbox={setSandbox}
        />
      )}
    </>
  )
}
