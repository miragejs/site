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
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq(`/repl/v1/${sandbox.id}`)
    })
  })

  it.only("can fork a v1 sandbox", () => {
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

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
      import { createServer } from "miragejs"

      export default createServer({
        routes() {
          this.get("/movies", () => ([
            { id: 1, name: "Inception", year: 2010 },
          ]))
        },
      })
      `
    )

    cy.get("[data-testid=status]").should(
      "contain",
      "You have unsaved changes."
    )

    cy.get("[data-testid=save]").click()

    cy.location().should((loc) => {
      expect(server.db.sandboxes.length).to.eq(2)

      // let sandbox = server.db.sandboxes[0]
      // expect(sandbox.config).to.eq(d`
      //   import { createServer } from "miragejs"

      //   export default createServer({
      //     routes() {
      //       this.get("/movies", () => ([
      //         { id: 1, name: "Inception", year: 2010 },
      //         { id: 2, name: "Interstellar", year: 2014 },
      //       ]))
      //     },
      //   })
      // `)
      // expect(loc.pathname).to.eq(`/repl/v2/${sandbox.id2}`)
    })
  })

  // it("shows an error state for a missing v1 sandbox")
})
