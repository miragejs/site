import d from "dedent"

describe("loading the repl via query params", () => {
  it("can use a query param for the config's initial value", () => {
    cy.visit(
      "/repl?config=aW1wb3J0IHsgU2VydmVyIH0gZnJvbSAibWlyYWdlanMiCgpleHBvcnQgZGVmYXVsdCBuZXcgU2VydmVyKHsKICByb3V0ZXMoKSB7CiAgICB0aGlzLmdldCgiL2FwaS9tb3ZpZXMiLCAoKSA9PiB7CiAgICAgIHJldHVybiB7CiAgICAgICAgbW92aWVzOiBbCiAgICAgICAgICB7IGlkOiAxLCBuYW1lOiAiSW5jZXB0aW9uIiwgeWVhcjogMjAxMCB9LAogICAgICAgICAgeyBpZDogMiwgbmFtZTogIkludGVyc3RlbGxhciIsIHllYXI6IDIwMTQgfSwKICAgICAgICAgIHsgaWQ6IDMsIG5hbWU6ICJEdW5raXJrIiwgeWVhcjogMjAxNyB9LAogICAgICAgIF0sCiAgICAgIH0KICAgIH0pCiAgfSwKfSk="
    )

    cy.get("[data-testid=config-input]")
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

    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.url().should("eq", `${Cypress.config().baseUrl}/repl`)

    cy.get("[data-testid=request-url]").type("/api/movies{enter}")
    cy.get("[data-testid=response-code]").should("contain", "200")
    cy.get("[data-testid=response-body]")
      .invoke("text")
      .then((text) => {
        let json = JSON.parse(text)

        expect(json.movies).to.have.lengthOf(3)
      })
  })

  it.only("can use a query param for the method and url's initial value", () => {
    cy.visit("/repl?method=GET&url=%2Fusers%2F1")

    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.url().should("eq", `${Cypress.config().baseUrl}/repl`)

    cy.get("[data-testid=request-method]").should("have.value", "GET")
    cy.get("[data-testid=request-url]").should("have.value", "/users/1")
  })
})
