describe("Docs", () => {
  it("it renders the overview page", () => {
    cy.visit("/docs/getting-started/overview")
    cy.get("h1").contains("Overview")
    cy.percySnapshot()
  })
})
