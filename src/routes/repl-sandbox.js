import React from "react"
import { useQuery } from "urql"
import LoadingShell from "./repl-sandbox-ssr-shell"

export default function ({ id, navigate }) {
  const [res] = useQuery({
    query: `
      query ($id: Int!) {
        sandboxes_by_pk(id: $id) {
          id
          config
        }
      }
    `,
    variables: {
      id,
    },
  })

  // Redirect if we find a Sandbox
  if (res.data?.sandboxes_by_pk) {
    let config = res.data.sandboxes_by_pk.config
    let serializedConfig = btoa(config)
    navigate(`/repl/?config=${serializedConfig}`)
  }

  if (res.data?.sandboxes_by_pk === null) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        REPL not found.
      </div>
    )
  } else {
    return <LoadingShell />
  }
}
