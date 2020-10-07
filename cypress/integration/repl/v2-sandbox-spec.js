import d from "dedent"
import { makeServer } from "../../../src/server-hasura"

describe("v2 sandboxes", () => {
  let server

  beforeEach(() => {
    server = makeServer()
  })

  afterEach(() => {
    server.shutdown()
  })

  it("can create a repl from /repl", () => {
    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/foo', () => ({ some: 'data' }))
          }
        })
      `
    )

    cy.get("[data-testid=save]").click()

    cy.location().should((loc) => {
      expect(server.db.sandboxes.length).to.eq(1)

      let newSandbox = server.db.sandboxes[0]
      expect(loc.pathname).to.eq(`/repl/v2/${newSandbox.id2}`)
    })
  })

  it("can load a repl", () => {
    server.logging = true
    let sandbox = server.create("sandbox", {
      config: d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.post('/foo', (schema, request) => {
              return JSON.parse(request.requestBody).some;
            })
          }
        })
      `,
      url: "/foo",
      method: "POST",
      request_body: JSON.stringify({ some: "data" }),
    })

    cy.visit(`/repl/v2/${sandbox.id2}`)

    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=send-request]").click()
    cy.get("[data-testid=response-code]").should("contain", "201")
    cy.get("[data-testid=response-body]")
      .invoke("text")
      .then((text) => {
        expect(text).to.equal('"data"')
      })
  })
})
