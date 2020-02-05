describe("API docs", () => {
  it("it renders the server api reference", () => {
    cy.visit("/api/classes/server")
    cy.get("h1").contains("Server")
    cy.screenshot("server api")
  })
})
