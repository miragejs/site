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
        createGraphQLHandler(graphQLSchema, this.schema, {
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
                let { _set, pk_columns } = args
                let { mirageSchema: schema } = context

                return schema.db.sandboxes.update(pk_columns.id, _set)
              },
            },
          },
        })
      )

      this.passthrough()
    },
  })
}
