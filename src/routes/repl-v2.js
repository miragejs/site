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

  const { createSandboxMutation, saveSandboxMutation } = useSandbox()

  function handleSave() {
    if (sandbox.browser_id === localStorage.getItem("repl:browser_id")) {
      saveSandbox()
    } else {
      forkSandbox()
    }
  }

  function saveSandbox() {
    localStorage.getItem("repl:editing_token")
    let { id, editingToken, ...sandboxAttrs } = sandbox

    saveSandboxMutation({ id, object: sandboxAttrs }).then((res) => {
      let {
        __typename,
        ...sandboxFromResponse
      } = res.data.update_sandboxes_by_pk
      setInitialSandbox(sandboxFromResponse)
    })
  }

  function forkSandbox() {
    let editingToken = nanoid()
    let browserId = shortNanoid()

    localStorage.setItem("repl:editing_token", editingToken)
    localStorage.setItem("repl:browser_id", browserId)

    let { id, ...newSandboxAttrs } = sandbox
    let attrs = {
      id2: shortNanoid(),
      editing_token: editingToken,
      browser_id: browserId,
      ...newSandboxAttrs,
    }

    createSandboxMutation({ object: attrs }).then((res) => {
      let { __typename, ...newSandbox } = res.data.insert_sandboxes_one
      setInitialSandbox(newSandbox)
      navigate(`/repl/v2/${newSandbox.id2}`)
    })
  }

  return !initialSandbox ? (
    <p>Loading...</p>
  ) : (
    <Repl
      hasChanges={initialSandbox.config !== sandbox.config}
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
  const [, createSandboxMutation] = useMutation(CreateSandbox)

  const SaveSandbox = `
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
  const [, saveSandboxMutation] = useMutation(SaveSandbox)

  return { createSandboxMutation, saveSandboxMutation }
}
