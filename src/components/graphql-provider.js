import React from "react"
import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  Provider as UrqlProvider,
} from "urql"
import { authExchange } from "@urql/exchange-auth"

const urqlClient = createClient({
  url: "https://miragejs-site-backend.herokuapp.com/v1/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      async getAuth() {
        return { editingToken: localStorage.getItem("repl:editingToken") }
      },
      addAuthToOperation({ authState, operation }) {
        if (!authState || !authState.editingToken) {
          return operation
        }
        const fetchOptions =
          typeof operation.context.fetchOptions === "function"
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {}

        console.log({ fetchOptions })

        return {
          ...operation,
          context: {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                "X-Repl-Editing-Token": authState.editingToken,
              },
            },
          },
        }
      },
    }),
    fetchExchange,
  ],
})

export const GraphQLProvider = ({ children }) => {
  return <UrqlProvider value={urqlClient}>{children}</UrqlProvider>
}
