import React, { useState } from "react"
import { useQuery } from "urql"
import queryString from "query-string"
import SEO from "../components/seo"
import Repl from "../components/repl"

export default function ({ id, navigate }) {
  let [initialSandbox, setInitialSandbox] = useState()
  let [sandbox, setSandbox] = useState()

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

  let hasntSetInitialSandbox = !initialSandbox && res.data

  if (hasntSetInitialSandbox) {
    let { __typename, ...sandboxFromResponse } = res.data.sandboxes_by_pk
    setInitialSandbox(sandboxFromResponse)
    setSandbox(sandboxFromResponse)
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

  function handleSave() {
    console.log("FORK ME")
  }

  return res.error || res.data?.sandboxes_by_pk === null ? (
    <div className="flex flex-col items-center justify-center flex-1">
      REPL not found.
    </div>
  ) : !initialSandbox ? (
    <div className="flex flex-col items-center justify-center flex-1">
      <div>Loading REPL...</div>
    </div>
  ) : (
    <>
      <SEO title={`REPL ${id}`} />

      <Repl
        hasChanges={hasChanges}
        onSave={handleSave}
        sandbox={sandbox}
        setSandbox={setSandbox}
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
