describe("Home Page", () => {
  it("it renders the homepage", () => {
    cy.visit("/")
    cy.get("[data-testid=title]").contains(
      "Build complete frontend features, even if your API doesn't exist."
    )
    cy.screenshot("home")
  })
})
