import { createServer, Factory } from "miragejs"
import graphqlSchema from "../schema.graphql.json"
import {
  createGraphQLHandler,
  mirageGraphQLFieldResolver,
} from "@miragejs/graphql"
import { buildClientSchema, printSchema } from "graphql"

let clientSchema = buildClientSchema(graphqlSchema)
let graphQLSchema = printSchema(clientSchema)

export function makeServer({ environment = "test" } = {}) {
  return createServer({
    environment,

    factories: {
      sandbox: Factory.extend({
        id2(i) {
          return `abc${i}`
        },
      }),
    },

    routes() {
      this.post(
        "https://miragejs-site-backend.herokuapp.com/v1/graphql",
        (schema, request) => {
          let handler = createGraphQLHandler(graphQLSchema, this.schema, {
            resolvers: {
              query_root: {
                sandboxes(obj, args, context, info) {
                  const { where } = args

                  delete args.where

                  let records = mirageGraphQLFieldResolver(
                    obj,
                    args,
                    context,
                    info
                  )

                  if (where) {
                    records = records.filter(
                      (record) => record.id2 === where.id2._eq
                    )
                  }

                  return records
                },
              },

              mutation_root: {
                update_sandboxes_by_pk(obj, args, context, info) {
                  let editingToken =
                    request.requestHeaders["x-repl-editing-token"]
                  let { _set, pk_columns } = args
                  let { mirageSchema: schema } = context
                  let sandboxId = pk_columns.id
                  let ownsSandbox =
                    editingToken ===
                    schema.db.sandboxes.find(sandboxId).editing_token

                  console.log({ headers: request.requestHeaders })
                  debugger

                  if (ownsSandbox) {
                    return schema.db.sandboxes.update(sandboxId, _set)
                  } else {
                    throw new Error(
                      "User does not have permission to update this sandbox"
                    )
                  }
                },
              },
            },
          })

          return handler(schema, request)
        }
      )

      this.passthrough()
    },
  })
}
