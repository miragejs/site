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

  if (res.data) {
    let config = res.data.sandboxes_by_pk.config
    let serializedConfig = btoa(config)
    navigate(`/repl/?config=${serializedConfig}`)
  } else {
    return <LoadingShell />
  }
}
