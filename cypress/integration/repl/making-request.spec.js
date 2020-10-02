import d from "dedent"

describe("making a request", () => {
  it("shows an error message if the request body is invalid JSON", () => {
    cy.visit("/repl")
    cy.get("[data-testid=request-method]").select("POST")
    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")
    cy.get("[data-testid=request-body-input]").typeInCodemirror(
      d`invalid JSON!`
    )
    cy.get("[data-testid=request-url]").type("{enter}")
    cy.contains("Request body must be JSON").should("exist")
  })

  it("shows an error message if the URL is blank", () => {
    cy.visit("/repl")
    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=request-url]").type("{selectall}{backspace}{enter}")

    cy.contains("The URL cannot be blank").should("exist")
  })

  it("shows an error for an unhandled request", () => {
    cy.visit("/repl")
    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")
    cy.get("[data-testid=request-url]").type("{selectall}/foo{enter}")

    cy.contains(
      "Your app tried to GET '/foo', but there was no route defined to handle this request"
    ).should("exist")
  })

  it("works for a GET request that responds with an HTTP error", () => {
    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { Server, Response } from "miragejs"

        export default new Server({
          routes() {
            this.get("/foo", () => new Response(500, {}, {errors: ['something happened']}))
          },
        })
      `
    )
    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=request-url]").type("{selectall}/foo{enter}")
    cy.get("[data-testid=response-code]").should("contain", "500")
    cy.get("[data-testid=response-body]")
      .invoke("text")
      .then((text) => {
        let json = JSON.parse(text)

        expect(json.errors[0]).to.equal("something happened")
      })
  })

  it("works for a GET request that responds with an HTTP success", () => {
    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { Server, Model, belongsTo } from "miragejs"

        export default new Server({
          models: {
            user: Model,
          },

          seeds(server) {
            server.create("user", { name: "Ryan" })
            server.create("user", { name: "Sam" })
          },

          routes() {
            this.resource("user")
          },
        })
      `
    )
    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=request-url]").type("{selectall}/users{enter}")
    cy.get("[data-testid=response-code]").should("contain", "200")
    cy.get("[data-testid=response-body]")
      .invoke("text")
      .then((text) => {
        let json = JSON.parse(text)

        expect(json.users).to.have.lengthOf(2)
      })
  })

  it("works for a PATCH request with a request body", () => {
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
            server.create('user', { name: 'Sam' })
          },

          routes() {
            this.resource("user")
          },
        })
      `
    )
    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=request-method]").select("PATCH")
    cy.get("[data-testid=request-url]").type("{selectall}/users/1")
    cy.get("[data-testid=request-body-input]").typeInCodemirror(
      d`
        {
          user: {
            name: 'Samuel'
          }
        }
        `
    )
    cy.get("[data-testid=send-request]").click()
    cy.get("[data-testid=response-code]").should("contain", "200")
    cy.get("[data-testid=response-body]")
      .invoke("text")
      .then((text) => {
        let json = JSON.parse(text)

        expect(json.user).to.deep.equal({ id: "1", name: "Samuel" })
      })
  })

  it("works for a POST request with a request body", () => {
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

          routes() {
            this.resource("user")
          },
        })
      `
    )
    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=request-method]").select("POST")
    cy.get("[data-testid=request-url]").type("{selectall}/users")
    cy.get("[data-testid=request-body-input]").typeInCodemirror(
      d`
        {
          user: {
            name: 'Peter'
          }
        }
        `
    )
    cy.get("[data-testid=send-request]").click()
    cy.get("[data-testid=response-code]").should("contain", "201")
    cy.get("[data-testid=response-body]")
      .invoke("text")
      .then((text) => {
        let json = JSON.parse(text)

        expect(json.user).to.deep.equal({ id: "1", name: "Peter" })
      })
  })

  it("works for a DELETE request", () => {
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

    cy.get("[data-testid=request-method]").select("DELETE")
    cy.get("[data-testid=request-url]").type("{selectall}/users/1")
    cy.get("[data-testid=send-request]").click()
    cy.get("[data-testid=response-code]").should("contain", "204")

    cy.get("[data-testid=request-method]").select("GET")
    cy.get("[data-testid=request-url]").type("{selectall}/users")
    cy.get("[data-testid=send-request]").click()
    cy.get("[data-testid=response-code]").should("contain", "200")
    cy.get("[data-testid=response-body]")
      .invoke("text")
      .then((text) => {
        let json = JSON.parse(text)

        expect(json.users).to.have.lengthOf(2)
      })
  })
})
