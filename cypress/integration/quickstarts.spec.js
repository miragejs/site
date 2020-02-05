describe("Quickstarts", () => {
  it("it renders the react quickstart", () => {
    cy.visit("/quickstarts/react/development")
    cy.get("h1").contains("Setup a React App with Mirage for Development")
    cy.screenshot("react quickstart")
  })
})
