import d from "dedent"

describe("REPL", () => {
  context("loading the repl", () => {
    it("can use a query param for the config's initial value", () => {
      cy.visit(
        "/repl?config=aW1wb3J0IHsgU2VydmVyIH0gZnJvbSAibWlyYWdlanMiCgpleHBvcnQgZGVmYXVsdCBuZXcgU2VydmVyKHsKICByb3V0ZXMoKSB7CiAgICB0aGlzLmdldCgiL2FwaS9tb3ZpZXMiLCAoKSA9PiB7CiAgICAgIHJldHVybiB7CiAgICAgICAgbW92aWVzOiBbCiAgICAgICAgICB7IGlkOiAxLCBuYW1lOiAiSW5jZXB0aW9uIiwgeWVhcjogMjAxMCB9LAogICAgICAgICAgeyBpZDogMiwgbmFtZTogIkludGVyc3RlbGxhciIsIHllYXI6IDIwMTQgfSwKICAgICAgICAgIHsgaWQ6IDMsIG5hbWU6ICJEdW5raXJrIiwgeWVhcjogMjAxNyB9LAogICAgICAgIF0sCiAgICAgIH0KICAgIH0pCiAgfSwKfSk="
      )

      cy.get("[data-testid=config-input]")
        .getContent()
        .should(
          "eq",
          d`
            import { createServer } from "miragejs"

            export default createServer({
              routes() {
                this.get("/api/movies", () => {
                  return {
                    movies: [
                      { id: 1, name: "Inception", year: 2010 },
                      { id: 2, name: "Interstellar", year: 2014 },
                      { id: 3, name: "Dunkirk", year: 2017 },
                    ],
                  }
                })
              },
            })
          `
        )

      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

      cy.url().should("eq", `${Cypress.config().baseUrl}/repl`)

      cy.get("[data-testid=request-url]").type("/api/movies{enter}")
      cy.get("[data-testid=response-code]").should("contain", "200")
      cy.get("[data-testid=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.movies).to.have.lengthOf(3)
        })
    })

    it("can use a query param for the method and url's initial value", () => {
      cy.visit("/repl?method=GET&url=%2Fusers%2F1")

      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

      cy.url().should("eq", `${Cypress.config().baseUrl}/repl`)

      cy.get("[data-testid=request-method]").should("have.value", "GET")
      cy.get("[data-testid=request-url]").should("have.value", "/users/1")
    })
  })

  context("database tab", () => {
    it("can show ids for polymorphic relationships ", () => {
      cy.visit(
        "/repl/?config=aW1wb3J0IHsgU2VydmVyLCBNb2RlbCwgYmVsb25nc1RvIH0gZnJvbSAibWlyYWdlanMiCgpleHBvcnQgZGVmYXVsdCBuZXcgU2VydmVyKHsKICBtb2RlbHM6IHsKICAgIGJsb2dQb3N0OiBNb2RlbC5leHRlbmQoewogICAgICBjb21tZW50OiBiZWxvbmdzVG8oKSwKICAgIH0pLAoKICAgIGNvbW1lbnQ6IE1vZGVsLmV4dGVuZCh7CiAgICAgIGNvbW1lbnRhYmxlOiBiZWxvbmdzVG8oeyBwb2x5bW9ycGhpYzogdHJ1ZSB9KSwKICAgIH0pLAogIH0sCgogIHNlZWRzKHNlcnZlcikgewogICAgbGV0IGJsb2dQb3N0ID0gc2VydmVyLmNyZWF0ZSgiYmxvZy1wb3N0Iik7CiAgICBzZXJ2ZXIuY3JlYXRlKCdjb21tZW50JywgewogICAgICBjb21tZW50YWJsZTogYmxvZ1Bvc3QKICAgIH0pCiAgfQp9KQ%3D%3D"
      )

      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

      cy.get("[data-testid=database]").click()
      cy.get("button").contains("Comments").click()

      cy.contains(`{"id":"1","type":"blog-post"}`).should("exist")
    })
  })

  context("editing the config", () => {
    it("shows a parsing error", () => {
      cy.visit("/repl")

      cy.get("[data-testid=config-input]").typeInCodemirror("asdf")

      cy.get("[data-testid=sandbox-error]", { timeout: 10000 }).should("exist")

      cy.get("[data-testid=parse-error]").should(
        "contain",
        "asdf is not defined"
      )
    })

    it("can recover from a parsing error", () => {
      cy.visit("/repl")

      cy.get("[data-testid=config-input]").typeInCodemirror("asdf")
      cy.get("[data-testid=sandbox-error]", { timeout: 10000 }).should("exist")

      cy.get("[data-testid=parse-error]").should(
        "contain",
        "asdf is not defined"
      )

      cy.get("[data-testid=config-input]").typeInCodemirror(
        d`
        import { createServer } from "miragejs"

        export default createServer({
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

  context("making a request", () => {
    it("shows an error message if the request body is invalid JSON", () => {
      cy.visit("/repl")
      cy.get("[data-testid=request-method]").select("POST")
      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")
      cy.get("[data-testid=request-body-input]").typeInCodemirror(
        d`invalid JSON!`
      )
      cy.get("[data-testid=request-url]").type("{enter}")
      cy.contains("Request body must be JSON").should("exist")
    })

    it("shows an error message if the URL is blank", () => {
      cy.visit("/repl")
      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

      cy.get("[data-testid=request-url]").type("{selectall}{backspace}{enter}")

      cy.contains("The URL cannot be blank").should("exist")
    })

    it("shows an error for an unhandled request", () => {
      cy.visit("/repl")
      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")
      cy.get("[data-testid=request-url]").type("{selectall}/foo{enter}")

      cy.contains(
        "Your app tried to GET '/foo', but there was no route defined to handle this request"
      ).should("exist")
    })

    it("works for a GET request that responds with an HTTP error", () => {
      cy.visit("/repl")

      cy.get("[data-testid=config-input]").typeInCodemirror(
        d`
        import { createServer, Response } from "miragejs"

        export default createServer({
          routes() {
            this.get("/foo", () => new Response(500, {}, {errors: ['something happened']}))
          },
        })
      `
      )
      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

      cy.get("[data-testid=request-url]").type("{selectall}/foo{enter}")
      cy.get("[data-testid=response-code]").should("contain", "500")
      cy.get("[data-testid=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.errors[0]).to.equal("something happened")
        })
    })

    it("works for a GET request that responds with an HTTP success", () => {
      cy.visit("/repl")

      cy.get("[data-testid=config-input]").typeInCodemirror(
        d`
        import { createServer, Model, belongsTo } from "miragejs"

        export default createServer({
          models: {
            user: Model,
          },

          seeds(server) {
            server.create("user", { name: "Ryan" })
            server.create("user", { name: "Sam" })
          },

          routes() {
            this.resource("user")
          },
        })
      `
      )
      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

      cy.get("[data-testid=request-url]").type("{selectall}/users{enter}")
      cy.get("[data-testid=response-code]").should("contain", "200")
      cy.get("[data-testid=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.users).to.have.lengthOf(2)
        })
    })

    it("works for a PATCH request with a request body", () => {
      cy.visit("/repl")

      cy.get("[data-testid=config-input]").typeInCodemirror(
        d`
        import { createServer, Model, RestSerializer } from "miragejs"

        export default createServer({
          serializers: {
            application: RestSerializer
          },

          models: {
            user: Model,
          },

          seeds(server) {
            server.create('user', { name: 'Sam' })
          },

          routes() {
            this.resource("user")
          },
        })
      `
      )
      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

      cy.get("[data-testid=request-method]").select("PATCH")
      cy.get("[data-testid=request-url]").type("{selectall}/users/1")
      cy.get("[data-testid=request-body-input]").typeInCodemirror(
        d`
        {
          user: {
            name: 'Samuel'
          }
        }
        `
      )
      cy.get("[data-testid=send-request]").click()
      cy.get("[data-testid=response-code]").should("contain", "200")
      cy.get("[data-testid=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.user).to.deep.equal({ id: "1", name: "Samuel" })
        })
    })

    it("works for a POST request with a request body", () => {
      cy.visit("/repl")

      cy.get("[data-testid=config-input]").typeInCodemirror(
        d`
        import { createServer, Model, RestSerializer } from "miragejs"

        export default createServer({
          serializers: {
            application: RestSerializer
          },

          models: {
            user: Model,
          },

          routes() {
            this.resource("user")
          },
        })
      `
      )
      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

      cy.get("[data-testid=request-method]").select("POST")
      cy.get("[data-testid=request-url]").type("{selectall}/users")
      cy.get("[data-testid=request-body-input]").typeInCodemirror(
        d`
        {
          user: {
            name: 'Peter'
          }
        }
        `
      )
      cy.get("[data-testid=send-request]").click()
      cy.get("[data-testid=response-code]").should("contain", "201")
      cy.get("[data-testid=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.user).to.deep.equal({ id: "1", name: "Peter" })
        })
    })

    it("works for a DELETE request", () => {
      cy.visit("/repl")

      cy.get("[data-testid=config-input]").typeInCodemirror(
        d`
        import { createServer, Model, RestSerializer } from "miragejs"

        export default createServer({
          serializers: {
            application: RestSerializer
          },

          models: {
            user: Model,
          },

          seeds(server) {
            server.createList('user', 3)
          },

          routes() {
            this.resource("user")
          },
        })
      `
      )
      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

      cy.get("[data-testid=request-method]").select("DELETE")
      cy.get("[data-testid=request-url]").type("{selectall}/users/1")
      cy.get("[data-testid=send-request]").click()
      cy.get("[data-testid=response-code]").should("contain", "204")

      cy.get("[data-testid=request-method]").select("GET")
      cy.get("[data-testid=request-url]").type("{selectall}/users")
      cy.get("[data-testid=send-request]").click()
      cy.get("[data-testid=response-code]").should("contain", "200")
      cy.get("[data-testid=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.users).to.have.lengthOf(2)
        })
    })

    it("updates the database after a mutation", () => {
      cy.visit("/repl")

      cy.get("[data-testid=config-input]").typeInCodemirror(
        d`
        import { createServer, Model, RestSerializer } from "miragejs"

        export default createServer({
          serializers: {
            application: RestSerializer
          },

          models: {
            user: Model,
          },

          seeds(server) {
            server.createList('user', 3)
          },

          routes() {
            this.resource("user")
          },
        })
      `
      )
      cy.get("[data-testid=sandbox-ready]", { timeout: 10000 }).should("exist")

      cy.get("[data-testid=database]").click()
      cy.get("[data-testid=database-record]").should("have.length", 3)

      cy.get("[data-testid=request-method]").select("DELETE")
      cy.get("[data-testid=request-url]").type("{selectall}/users/1")
      cy.get("[data-testid=send-request]").click()
      cy.get("[data-testid=response-code]").should("contain", "204")

      cy.get("[data-testid=database-record]").should("have.length", 2)
    })
  })
})
