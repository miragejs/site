import d from "dedent"

describe.only("editing the config", () => {
  it("shows a parsing error", () => {
    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror("asdf")

    cy.get("[data-testid=sandbox-error]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=parse-error]").should("contain", "asdf is not defined")
  })

  it("can recover from a parsing error", () => {
    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror("asdf")
    cy.get("[data-testid=sandbox-error]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=parse-error]").should("contain", "asdf is not defined")

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { Server } from "miragejs"

        export default new Server({
        })
      `
    )
    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")
    cy.get("[data-testid=parse-error]").should("not.exist")
  })

  it("shows a message if the config doesn't export a Mirage server instance", () => {
    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        export default "foo"
      `
    )
    cy.get("[data-testid=sandbox-error]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=parse-error]").should(
      "contain",
      "A Mirage Server instance must be the default export from your config."
    )
  })

  it("shows a message if the config is blank", () => {
    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror(d``)

    cy.get("[data-testid=sandbox-error]").should("exist")
    cy.get("[data-testid=parse-error]").should(
      "contain",
      "A Mirage Server instance must be the default export from your config."
    )
  })
})
