import d from "dedent"

describe("database tab", () => {
  it("can show ids for polymorphic relationships ", () => {
    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { createServer, Model, belongsTo } from "miragejs"

        export default createServer({
          models: {
            blogPost: Model.extend({
              comment: belongsTo(),
            }),

            comment: Model.extend({
              commentable: belongsTo({ polymorphic: true }),
            }),
          },

          seeds(server) {
            let blogPost = server.create("blog-post");
            server.create('comment', {
              commentable: blogPost
            })
          }
        })
      `
    )

    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=database]").click()
    cy.get("button").contains("Comments").click()

    cy.contains(`{"id":"1","type":"blog-post"}`).should("exist")
  })

  it("updates the database after a mutation", () => {
    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { Server, Model, RestSerializer } from "miragejs"

        export default new Server({
          serializers: {
            application: RestSerializer
          },

          models: {
            user: Model,
          },

          seeds(server) {
            server.createList('user', 3)
          },

          routes() {
            this.resource("user")
          },
        })
      `
    )
    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=database]").click()
    cy.get("[data-testid=database-record]").should("have.length", 3)

    cy.get("[data-testid=request-method]").select("DELETE")
    cy.get("[data-testid=request-url]").type("{selectall}/users/1")
    cy.get("[data-testid=send-request]").click()
    cy.get("[data-testid=response-code]").should("contain", "204")

    cy.get("[data-testid=database-record]").should("have.length", 2)
  })
})
