import React from "react"
import { useQuery } from "urql"
import queryString from "query-string"

export default function ({ id, navigate }) {
  const [res] = useQuery({
    query: `
      query ($id: Int!) {
        sandboxes_by_pk(id: $id) {
          id
          config
          method
          request_body
          url
        }
      }
    `,
    variables: {
      id,
    },
  })

  // Redirect if we find a Sandbox
  if (res.data?.sandboxes_by_pk) {
    let { config, method, request_body, url } = res.data.sandboxes_by_pk
    let params = { config: btoa(config), method, url, body: request_body }
    let search = queryString.stringify(params)
    navigate(`/repl?${search}`)
  }

  if (res.error || res.data?.sandboxes_by_pk === null) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        REPL not found.
      </div>
    )
  } else {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <div>Loading REPL...</div>
      </div>
    )
  }
}
