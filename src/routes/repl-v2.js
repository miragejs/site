import React, { useState } from "react"
import { useQuery } from "urql"
import Repl from "../components/repl"
import { useMutation } from "urql"
import { nanoid, customAlphabet } from "nanoid"

const shortNanoid = customAlphabet("1234567890abcdef", 10)

export default function ({ id2, navigate }) {
  let [initialSandbox, setInitialSandbox] = useState()
  let [sandbox, setSandbox] = useState()
  let [res] = useQuery({
    query: `
      query ($id2: String!) {
        sandboxes(where: {id2: {_eq: $id2}}) {
          id
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

  if (!initialSandbox && res.data) {
    let { __typename, ...sandboxFromResponse } = res.data.sandboxes[0]
    setInitialSandbox(sandboxFromResponse)
    setSandbox(sandboxFromResponse)
  }

  const { createSandbox, updateSandbox } = useSandbox()

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

  return !initialSandbox ? (
    <p>Loading...</p>
  ) : (
    <Repl
      hasChanges={hasChanges}
      onSave={handleSave}
      sandbox={sandbox}
      setSandbox={setSandbox}
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

  const UpdateSandbox = `
    mutation ($id: Int!, $object: sandboxes_set_input!) {
      update_sandboxes_by_pk(pk_columns: {id: $id}, _set: $object) {
        id
        id2
        config
        method
        request_body
        url
      }
    }
  `
  const [, updateSandbox] = useMutation(UpdateSandbox)

  return { createSandbox, updateSandbox }
}
