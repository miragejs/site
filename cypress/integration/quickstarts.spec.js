describe("Quickstarts", () => {
  it("it renders the react component quickstart", () => {
    cy.visit("/quickstarts/react/develop-a-component")
    cy.get("h1").contains("Develop a React Component with Mirage")
    cy.screenshot("react quickstart")
  })
})
