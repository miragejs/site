import d from "dedent"

describe.only("loading the repl via query params", () => {
  it("can use a query param for the config's initial value", () => {
    cy.visit(
      "/repl?config=aW1wb3J0IHsgY3JlYXRlU2VydmVyIH0gZnJvbSAibWlyYWdlanMiCgpleHBvcnQgZGVmYXVsdCBjcmVhdGVTZXJ2ZXIoewogIHJvdXRlcygpIHsKICAgIHRoaXMubmFtZXNwYWNlID0gImFwaSIKCiAgICB0aGlzLmdldCgiL21vdmllcyIsICgpID0%2BIHsKICAgICAgcmV0dXJuIHsKICAgICAgICBtb3ZpZXM6IFsKICAgICAgICAgIHsgaWQ6IDEsIG5hbWU6ICJJbmNlcHRpb24iLCB5ZWFyOiAyMDEwIH0sCiAgICAgICAgICB7IGlkOiAyLCBuYW1lOiAiSW50ZXJzdGVsbGFyIiwgeWVhcjogMjAxNCB9LAogICAgICAgICAgeyBpZDogMywgbmFtZTogIkR1bmtpcmsiLCB5ZWFyOiAyMDE3IH0sCiAgICAgICAgXSwKICAgICAgfQogICAgfSkKICB9LAp9KQ%3D%3D"
    )

    cy.get("[data-testid=config-input]")
      .getContent()
      .should(
        "eq",
        d`
          import { createServer } from "miragejs"

          export default createServer({
            routes() {
              this.namespace = "api"

              this.get("/movies", () => {
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
