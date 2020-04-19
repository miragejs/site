import d from "dedent"

describe("REPL", () => {
  context("editing the config", () => {
    it("shows a parsing error", () => {
      cy.visit("/repl")

      cy.get(".CodeMirror").typeInCodemirror("asdf")
      cy.get("[data-testid=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-testid=parse-error]").should(
        "contain",
        "asdf is not defined"
      )
    })

    it("can recover from a parsing error", () => {
      cy.visit("/repl")

      cy.get(".CodeMirror").typeInCodemirror("asdf")
      cy.get("[data-testid=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-testid=parse-error]").should(
        "contain",
        "asdf is not defined"
      )

      cy.get(".CodeMirror").typeInCodemirror(
        d`
        import { Server } from "miragejs"

        export default new Server({
        })
      `
      )
      cy.get("[data-testid=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )
      cy.get("[data-testid=parse-error]").should("not.exist")
    })

    it("shows a message if the config doesn't export a Mirage server instance", () => {
      cy.visit("/repl")

      cy.get(".CodeMirror").typeInCodemirror(
        d`
        export default "foo"
      `
      )
      cy.get("[data-testid=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-testid=parse-error]").should(
        "contain",
        "A Mirage Server instance must be the default export from your config."
      )
    })
  })

  context("making a request", () => {
    // it("shows an error message if the URL is blank", () => {})

    it("shows the JSON response after submitting a request", () => {
      cy.visit("/repl")

      cy.get(".CodeMirror").typeInCodemirror(
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
      cy.get("[data-testid=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-testid=request-url]").type("/users{enter}")
      cy.get("[data-testid=response-code]").should("contain", "200")
      cy.get("[data-testid=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.users).to.have.lengthOf(2)
        })
    })
  })
})
