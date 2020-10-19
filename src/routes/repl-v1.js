import React, { useState } from "react"
import { useMutation, useQuery } from "urql"
import SEO from "../components/seo"
import Repl from "../components/repl"

import { nanoid, customAlphabet } from "nanoid"

const shortNanoid = customAlphabet("1234567890abcdef", 10)

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

  const { createSandbox } = useSandbox()

  function handleSave() {
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
      navigate(`/repl/v2/${newSandbox.id2}`, { state: { sandbox: newSandbox } })
    })
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

function useSandbox() {
  const CreateSandbox = `
    mutation ($object: sandboxes_insert_input!) {
      insert_sandboxes_one(object: $object) {
        id
        id2
        browser_id
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
