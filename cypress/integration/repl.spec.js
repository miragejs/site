import d from "dedent"

describe("REPL", () => {
  context("loading the repl", () => {
    it("can use a base 64-encoded query param for the config's initial value", () => {
      cy.visit(
        "/repl?config=aW1wb3J0IHsgU2VydmVyIH0gZnJvbSAibWlyYWdlanMiCgpleHBvcnQgZGVmYXVsdCBuZXcgU2VydmVyKHsKICByb3V0ZXMoKSB7CiAgICB0aGlzLmdldCgiL2FwaS9tb3ZpZXMiLCAoKSA9PiB7CiAgICAgIHJldHVybiB7CiAgICAgICAgbW92aWVzOiBbCiAgICAgICAgICB7IGlkOiAxLCBuYW1lOiAiSW5jZXB0aW9uIiwgeWVhcjogMjAxMCB9LAogICAgICAgICAgeyBpZDogMiwgbmFtZTogIkludGVyc3RlbGxhciIsIHllYXI6IDIwMTQgfSwKICAgICAgICAgIHsgaWQ6IDMsIG5hbWU6ICJEdW5raXJrIiwgeWVhcjogMjAxNyB9LAogICAgICAgIF0sCiAgICAgIH0KICAgIH0pCiAgfSwKfSk="
      )

      cy.get(".CodeMirror")
        .getContent()
        .should(
          "eq",
          d`
            import { Server } from "miragejs"

            export default new Server({
              routes() {
                this.get("/api/movies", () => {
                  return {
                    movies: [
                      { id: 1, name: "Inception", year: 2010 },
                      { id: 2, name: "Interstellar", year: 2014 },
                      { id: 3, name: "Dunkirk", year: 2017 },
                    ],
                  }
                })
              },
            })
          `
        )
    })
  })
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

    it.only("tracks the config's value in the URL with a base 64-encoded query param", () => {
      cy.visit("/repl")

      cy.get(".CodeMirror").typeInCodemirror(
        d`
        import { Server } from "miragejs"

        export default new Server()
        `
      )

      cy.url().should(
        "include",
        "/repl/?config=aW1wb3J0IHsgU2VydmVyIH0gZnJvbSAibWlyYWdlanMiCgpleHBvcnQgZGVmYXVsdCBuZXcgU2VydmVyKCk"
      )
    })
  })

  context("making a request", () => {
    xit("shows an error message if the URL is blank", () => {})

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
