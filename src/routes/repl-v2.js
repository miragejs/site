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

  const { createSandbox } = useSandbox()

  function handleSave() {
    let editingToken = nanoid()
    let browserId = shortNanoid()

    localStorage.setItem("repl:editingToken", editingToken)
    localStorage.setItem("repl:browserId", browserId)

    let { id, ...newSandboxAttrs } = sandbox
    let attrs = {
      id2: shortNanoid(),
      editing_token: editingToken,
      browser_id: browserId,
      ...newSandboxAttrs,
    }

    createSandbox({ object: attrs }).then((res) => {
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
  const [, createSandbox] = useMutation(CreateSandbox)

  return { createSandbox }
}
