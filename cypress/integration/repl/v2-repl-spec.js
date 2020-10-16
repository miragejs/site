import d from "dedent"
import { makeServer } from "../../../src/server-hasura"

describe("v2 repl", () => {
  let server

  beforeEach(() => {
    server = makeServer()
  })

  afterEach(() => {
    server.shutdown()

    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  it("can create a sandbox from /repl", () => {
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

    cy.get("[data-testid=status]").should(
      "contain",
      "You have unsaved changes."
    )

    cy.get("[data-testid=save]").click()

    cy.location().should((loc) => {
      expect(server.db.sandboxes.length).to.eq(1)

      let newSandbox = server.db.sandboxes[0]
      expect(loc.pathname).to.eq(`/repl/v2/${newSandbox.id2}`)
    })
  })

  it("can load a sandbox", () => {
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

  it("can fork a sandbox", () => {
    let sandbox = server.create("sandbox", {
      config: d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get("/movies", () => ([
              { id: 1, name: "Inception", year: 2010 },
            ]))
          },
        })
      `,
      url: "/movies",
      method: "GET",
    })

    cy.visit(`/repl/v2/${sandbox.id2}`)

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
      import { createServer } from "miragejs"

      export default createServer({
        routes() {
          this.get("/movies", () => ([
            { id: 1, name: "Inception", year: 2010 },
            { id: 2, name: "Interstellar", year: 2014 },
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

    cy.get("[data-testid=repl]").should("exist")
    cy.get("[data-testid=status]").should(
      "not.contain",
      "You have unsaved changes."
    )

    cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

    cy.get("[data-testid=send-request]").click()

    cy.get("[data-testid=response-body]")
      .should("exist")
      .invoke("text")
      .then((text) => {
        let json = JSON.parse(text)

        expect(json).to.deep.equal([
          { id: 1, name: "Inception", year: 2010 },
          { id: 2, name: "Interstellar", year: 2014 },
        ])
      })
  })

  it("can update a user's sandbox", () => {
    server.logging = true
    cy.window().then((win) => {
      win.localStorage.setItem("repl:browserId", "my-browser")
      win.localStorage.setItem("repl:editingToken", "my-editing-token")
    })
    let sandbox = server.create("sandbox", {
      browser_id: "my-browser",
      editing_token: "my-editing-token",
      config: d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get("/movies", () => ([
              { id: 1, name: "Inception", year: 2010 },
            ]))
          },
        })
      `,
      url: "/movies",
      method: "GET",
    })

    cy.visit(`/repl/v2/${sandbox.id2}`)

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
      import { createServer } from "miragejs"

      export default createServer({
        routes() {
          this.get("/movies", () => ([
            { id: 1, name: "Inception", year: 2010 },
            { id: 2, name: "Interstellar", year: 2014 },
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

    cy.get("[data-testid=status]").should(
      "not.contain",
      "You have unsaved changes."
    )

    cy.location().should((loc) => {
      expect(server.db.sandboxes.length).to.eq(1)

      let sandbox = server.db.sandboxes[0]
      expect(sandbox.config).to.eq(d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get("/movies", () => ([
              { id: 1, name: "Inception", year: 2010 },
              { id: 2, name: "Interstellar", year: 2014 },
            ]))
          },
        })
      `)
      expect(loc.pathname).to.eq(`/repl/v2/${sandbox.id2}`)
    })
  })

  it("can create a sandbox then update it", () => {
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

    cy.get("[data-testid=status]").should(
      "contain",
      "You have unsaved changes."
    )

    cy.get("[data-testid=save]").click()

    cy.location().should((loc) => {
      expect(server.db.sandboxes.length).to.eq(1)

      let newSandbox = server.db.sandboxes[0]
      expect(loc.pathname).to.eq(`/repl/v2/${newSandbox.id2}`)
    })

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/foo', () => ({ some: 'new data' }))
          }
        })
      `
    )

    cy.get("[data-testid=save]").click()

    cy.location().should((loc) => {
      expect(server.db.sandboxes.length).to.eq(1)

      let existingSandbox = server.db.sandboxes[0]
      expect(loc.pathname).to.eq(`/repl/v2/${existingSandbox.id2}`)
      expect(existingSandbox.config).to.eq(d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/foo', () => ({ some: 'new data' }))
          }
        })
      `)
    })
  })

  it("lets a user update an existing sandbox after creating a new one from /repl", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("repl:browserId", "my-browser")
      win.localStorage.setItem("repl:editingToken", "my-editing-token")
    })
    let existingSandbox = server.create("sandbox", {
      browser_id: "my-browser",
      editing_token: "my-editing-token",
      config: d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/movies', () => ([ { id: 1, name: 'Inception' }]))
          }
        })
      `,
      url: "/movies",

      method: "GET",
    })

    cy.visit("/repl")

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/games', () => ([ { id: 1, name: 'Breath of the Wild' }]))
          }
        })
      `
    )

    cy.get("[data-testid=save]").click()

    cy.visit(`/repl/v2/${existingSandbox.id2}`)

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/movies', () => ([
              { id: 1, name: 'Inception' },
              { id: 2, name: 'Interstellar' },
            ]))
          }
        })
      `
    )

    cy.get("[data-testid=save]").click()

    cy.location().should((loc) => {
      expect(server.db.sandboxes.length).to.eq(2)

      expect(loc.pathname).to.eq(`/repl/v2/${existingSandbox.id2}`)

      expect(server.db.sandboxes.find(existingSandbox.id).config).to.eq(d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/movies', () => ([
              { id: 1, name: 'Inception' },
              { id: 2, name: 'Interstellar' },
            ]))
          }
        })
      `)
    })
  })

  it("lets a user update an existing sandbox after forking one", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("repl:browserId", "my-browser")
      win.localStorage.setItem("repl:editingToken", "my-editing-token")
    })
    let existingSandbox = server.create("sandbox", {
      browser_id: "my-browser",
      editing_token: "my-editing-token",
      config: d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/movies', () => ([ { id: 1, name: 'Inception' }]))
          }
        })
      `,
      url: "/movies",

      method: "GET",
    })
    let otherUsersSandbox = server.create("sandbox", {
      browser_id: "other-users-browser",
      editing_token: "other-users-editing-token",
      config: "",
      url: "/movies",
      method: "GET",
    })

    cy.visit(`/repl/v2/${otherUsersSandbox.id2}`)

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/games', () => ([ { id: 1, name: 'Breath of the Wild' }]))
          }
        })
      `
    )

    cy.get("[data-testid=save]").click()

    cy.visit(`/repl/v2/${existingSandbox.id2}`)

    cy.get("[data-testid=config-input]").typeInCodemirror(
      d`
      import { createServer } from "miragejs"

      export default createServer({
        routes() {
          this.get('/movies', () => ([
            { id: 1, name: 'Inception' },
            { id: 2, name: 'Interstellar' }
          ]))
        }
      })
      `
    )

    cy.get("[data-testid=save]").click()

    cy.location().should((loc) => {
      expect(server.db.sandboxes.length).to.eq(3)

      expect(loc.pathname).to.eq(`/repl/v2/${existingSandbox.id2}`)

      expect(server.db.sandboxes.find(existingSandbox.id).config).to.eq(d`
        import { createServer } from "miragejs"

        export default createServer({
          routes() {
            this.get('/movies', () => ([
              { id: 1, name: 'Inception' },
              { id: 2, name: 'Interstellar' }
            ]))
          }
        })
      `)
    })
  })
})

// it("shows an error state for a missing v2 sandbox")
