import d from "dedent"
import { makeServer } from "../../../src/server-hasura"

describe("v1 repl", () => {
  let server

  beforeEach(() => {
    server = makeServer()
  })

  afterEach(() => {
    server.shutdown()
  })

  it("can load v1 sandboxes", () => {
    let sandbox = server.create("sandbox", {
      id: "1",
      config: d`
        import { createServer } from 'miragejs';

        export default createServer();
      `,
      url: "/foo",
      method: "PUT",
    })

    cy.visit(`/repl/v1/${sandbox.id}`)

    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=config-input]")
      .getContent()
      .should(
        "eq",
        d`
          import { createServer } from 'miragejs';

          export default createServer();
        `
      )
    cy.get("[data-testid=request-method]").should("have.value", "PUT")
    cy.get("[data-testid=request-url]").should("have.value", "/foo")
    cy.url().should("eq", `${Cypress.config().baseUrl}/repl`)
  })

  // it('can fork a v1 sandbox')

  // it("shows an error state for a missing v1 sandbox")
})
