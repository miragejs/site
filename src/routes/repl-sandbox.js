import React from "react"
import { useQuery } from "urql"

export default function ({ id, navigate, noop }) {
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

  // if (res.data) {
  //   let config = res.data.sandboxes_by_pk.config
  //   let serializedConfig = btoa(config)
  //   navigate(`/repl/?config=${serializedConfig}`)
  // }

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div>Loading REPL...</div>
    </div>
  )
}
