import d from "dedent"
import { createServer, Factory } from "miragejs"
import graphqlSchema from "../../../schema.graphql.json"
import { createGraphQLHandler } from "@miragejs/graphql"
import { buildClientSchema, printSchema } from "graphql"

let clientSchema = buildClientSchema(graphqlSchema)
let graphQLSchema = printSchema(clientSchema)

describe("saving repls", () => {
  let server

  beforeEach(() => {
    server = createServer({
      environment: "test",
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
          createGraphQLHandler(graphQLSchema, this.schema)
        )

        this.passthrough()
      },
    })
  })

  afterEach(() => {
    server.shutdown()
  })

  it("can load v1 sandboxes", () => {
    server.logging = true
    let sandbox = server.create("sandbox", {
      id: "1",
      config: d`
        import { createServer } from 'miragejs';

        export default createServer();
      `,
      url: "/foo",
      method: "PUT",
    })

    cy.visit(`/repl/v1/${sandbox.id}`)

    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=config-input]")
      .getContent()
      .should(
        "eq",
        d`
          import { createServer } from 'miragejs';

          export default createServer();
        `
      )
    cy.get("[data-testid=request-method]").should("have.value", "PUT")
    cy.get("[data-testid=request-url]").should("have.value", "/foo")
    cy.url().should("eq", `${Cypress.config().baseUrl}/repl`)
  })
})
