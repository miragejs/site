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

    // server.logging = true
  })

  afterEach(() => {
    server.shutdown()
  })

  it("shows a message when the user edits the default config", () => {
    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/foo', () => ({ some: "data" }))
          }
        })
      `
    )

    cy.get("[data-testid=status]").should(
      "contain",
      "You have unsaved changes."
    )
  })

  it("can create sandboxes and redirect to their unique URL", () => {
    cy.visit("/repl")

    cy.get("[data-testid=save]").click()
    cy.location().should((loc) => {
      expect(server.db.sandboxes.length).to.eq(1)

      let newSandbox = server.db.sandboxes[0]
      expect(loc.pathname).to.eq(`/repl/v2/${newSandbox.id2}`)
    })
  })

  // it.only("load sandboxes", () => {
  //   let sandbox = server.create("sandbox", { config: "foo" })
  //   cy.visit(`/repl/v2/${sandbox.id2}`)

  //   // cy.pause()

  //   cy.get("[data-testid=config-input]").getContent().should("eq", "foo")
  // })
})
