import React from "react"
import { createClient, Provider as UrqlProvider } from "urql"

const urqlClient = createClient({
  url: "https://miragejs-site-backend.herokuapp.com/v1/graphql",
  fetchOptions: () => {
    return {
      headers: {
        "X-Hasura-Repl-Editing-Token": localStorage.getItem(
          "repl:editingToken"
        ),
      },
    }
  },
})

export const GraphQLProvider = ({ children }) => {
  return <UrqlProvider value={urqlClient}>{children}</UrqlProvider>
}
