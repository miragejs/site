import d from "dedent"

describe("REPL", () => {
  context("loading the repl", () => {
    it("can use a query param for the config's initial value", () => {
      cy.visit(
        "/repl?config=aW1wb3J0IHsgU2VydmVyIH0gZnJvbSAibWlyYWdlanMiCgpleHBvcnQgZGVmYXVsdCBuZXcgU2VydmVyKHsKICByb3V0ZXMoKSB7CiAgICB0aGlzLmdldCgiL2FwaS9tb3ZpZXMiLCAoKSA9PiB7CiAgICAgIHJldHVybiB7CiAgICAgICAgbW92aWVzOiBbCiAgICAgICAgICB7IGlkOiAxLCBuYW1lOiAiSW5jZXB0aW9uIiwgeWVhcjogMjAxMCB9LAogICAgICAgICAgeyBpZDogMiwgbmFtZTogIkludGVyc3RlbGxhciIsIHllYXI6IDIwMTQgfSwKICAgICAgICAgIHsgaWQ6IDMsIG5hbWU6ICJEdW5raXJrIiwgeWVhcjogMjAxNyB9LAogICAgICAgIF0sCiAgICAgIH0KICAgIH0pCiAgfSwKfSk="
      )

      cy.get("[data-test-id=config-input]")
        .getContent()
        .should(
          "eq",
          d`
            import { Server } from "miragejs"

            export default new Server({
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

      cy.get("[data-test-id=sandbox-loading]").should("exist")
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=request-url]").type("/api/movies{enter}")
      cy.get("[data-test-id=response-code]").should("contain", "200")
      cy.get("[data-test-id=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.movies).to.have.lengthOf(3)
        })
    })

    it("can use a query param for the method and url's initial value", () => {
      cy.visit("/repl?method=GET&url=%2Fusers%2F1")

      cy.get("[data-test-id=sandbox-loading]").should("exist")
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=request-method]").should("have.value", "GET")
      cy.get("[data-test-id=request-url]").should("have.value", "/users/1")
      cy.get("[data-test-id=send-request]").click()
      cy.get("[data-test-id=request-pending]").should("not.exist")

      cy.get("[data-test-id=response-code]").should("contain", "200")
      cy.get("[data-test-id=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.user).to.exist
        })
    })
  })

  context("editing the config", () => {
    it("shows a parsing error", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror("asdf")
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=parse-error]").should(
        "contain",
        "asdf is not defined"
      )
    })

    it("can recover from a parsing error", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror("asdf")
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=parse-error]").should(
        "contain",
        "asdf is not defined"
      )

      cy.get("[data-test-id=config-input]").typeInCodemirror(
        d`
        import { Server } from "miragejs"

        export default new Server({
        })
      `
      )
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )
      cy.get("[data-test-id=parse-error]").should("not.exist")
    })

    it("shows a message if the config doesn't export a Mirage server instance", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror(
        d`
        export default "foo"
      `
      )
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=parse-error]").should(
        "contain",
        "A Mirage Server instance must be the default export from your config."
      )
    })

    it("tracks the config's value in the config query param in the URL", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror(
        d`
        import { Server } from "miragejs"

        export default new Server()
        `
      )

      cy.url().should(
        "include",
        "/repl/?config=aW1wb3J0IHsgU2VydmVyIH0gZnJvbSAibWlyYWdlanMiCgpleHBvcnQgZGVmYXVsdCBuZXcgU2VydmVyKCk"
      )
    })

    it("shows a message if the config is too large to be tracked in the URL", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror(
        d`
        import { Server } from "miragejs"

        export default new Server({
          routes() {
            this.get("/api/posts", () => ({
              text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus facilis pariatur dolorum corporis nemo perspiciatis officia deserunt minus eum quos animi tenetur nesciunt magnam nobis, modi minima cumque magni aperiam. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus facilis pariatur dolorum corporis nemo perspiciatis officia deserunt minus eum quos animi tenetur nesciunt magnam nobis, modi minima cumque magni aperiam. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus facilis pariatur dolorum corporis nemo perspiciatis officia deserunt minus eum quos animi tenetur nesciunt magnam nobis, modi minima cumque magni aperiam. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus facilis pariatur dolorum corporis nemo perspiciatis officia deserunt minus eum quos animi tenetur nesciunt magnam nobis, modi minima cumque magni aperiam. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus facilis pariatur dolorum corporis nemo perspiciatis officia deserunt minus eum quos animi tenetur nesciunt magnam nobis, modi minima cumque magni aperiam. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus facilis pariatur dolorum corporis nemo perspiciatis officia deserunt minus eum quos animi tenetur nesciunt magnam nobis, modi minima cumque magni aperiam. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus facilis pariatur dolorum corporis nemo perspiciatis officia deserunt minus eum quos animi tenetur nesciunt magnam nobis, modi minima cumque magni aperiam. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus facilis pariatur dolorum corporis nemo perspiciatis officia deserunt minus eum quos animi tenetur nesciunt magnam nobis, modi minima cumque magni aperiam."
            }))
          },
        })
        `
      )
      cy.get("[data-test-id=config-length-warning]").should(
        "contain",
        "Your config is too long"
      )
    })
  })

  context("making a request", () => {
    xit("does what if the request body is not JSON?", () => {})

    it("shows an error message if the URL is blank", () => {
      cy.visit("/repl")
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )
      cy.get("[data-test-id=request-url]").type("{enter}")

      cy.contains("The URL cannot be blank").should("exist")
    })

    it("shows an error for an unhandled request", () => {
      cy.visit("/repl")
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )
      cy.get("[data-test-id=request-url]").type("/foo{enter}")

      cy.contains(
        "Your app tried to GET '/foo', but there was no route defined to handle this request"
      ).should("exist")
    })

    it("tracks the method and URL's value in their respective query params", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=request-method]").select("DELETE")
      cy.get("[data-test-id=request-url]").type("/users/1")

      cy.url().should("include", "/repl/?method=DELETE&url=%2Fusers%2F1")
    })

    it("works for a GET request that responds with an HTTP error", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror(
        d`
        import { Server, Response } from "miragejs"

        export default new Server({
          routes() {
            this.get("/foo", () => new Response(500, {}, {errors: ['something happened']}))
          },
        })
      `
      )
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=request-url]").type("/foo{enter}")
      cy.get("[data-test-id=response-code]").should("contain", "500")
      cy.get("[data-test-id=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.errors[0]).to.equal("something happened")
        })
    })

    it("works for a GET request that responds with an HTTP success", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror(
        d`
        import { Server, Model, belongsTo } from "miragejs"

        export default new Server({
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
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=request-url]").type("/users{enter}")
      cy.get("[data-test-id=response-code]").should("contain", "200")
      cy.get("[data-test-id=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.users).to.have.lengthOf(2)
        })
    })

    it("works for a PATCH request with a request body", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror(
        d`
        import { Server, Model, RestSerializer } from "miragejs"

        export default new Server({
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
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=request-method]").select("PATCH")
      cy.get("[data-test-id=request-url]").type("/users/1")
      cy.get("[data-test-id=request-body-input]").typeInCodemirror(
        d`
        {
          user: {
            name: 'Samuel'
          }
        }
        `
      )
      cy.get("[data-test-id=send-request]").click()
      cy.get("[data-test-id=response-code]").should("contain", "200")
      cy.get("[data-test-id=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.user).to.deep.equal({ id: "1", name: "Samuel" })
        })
    })

    it("works for a POST request with a request body", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror(
        d`
        import { Server, Model, RestSerializer } from "miragejs"

        export default new Server({
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
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=request-method]").select("POST")
      cy.get("[data-test-id=request-url]").type("/users")
      cy.get("[data-test-id=request-body-input]").typeInCodemirror(
        d`
        {
          user: {
            name: 'Peter'
          }
        }
        `
      )
      cy.get("[data-test-id=send-request]").click()
      cy.get("[data-test-id=response-code]").should("contain", "201")
      cy.get("[data-test-id=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.user).to.deep.equal({ id: "1", name: "Peter" })
        })
    })

    it("works for a DELETE request", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror(
        d`
        import { Server, Model, RestSerializer } from "miragejs"

        export default new Server({
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
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=request-method]").select("DELETE")
      cy.get("[data-test-id=request-url]").type("/users/1")
      cy.get("[data-test-id=send-request]").click()
      cy.get("[data-test-id=response-code]").should("contain", "204")

      cy.get("[data-test-id=request-method]").select("GET")
      cy.get("[data-test-id=request-url]").type("{selectall}/users")
      cy.get("[data-test-id=send-request]").click()
      cy.get("[data-test-id=response-code]").should("contain", "200")
      cy.get("[data-test-id=response-body]")
        .invoke("text")
        .then((text) => {
          let json = JSON.parse(text)

          expect(json.users).to.have.lengthOf(2)
        })
    })

    it("updates the database after a mutation", () => {
      cy.visit("/repl")

      cy.get("[data-test-id=config-input]").typeInCodemirror(
        d`
        import { Server, Model, RestSerializer } from "miragejs"

        export default new Server({
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
      cy.get("[data-test-id=sandbox-loading]", { timeout: 10000 }).should(
        "not.exist"
      )

      cy.get("[data-test-id=database]").click()
      cy.get("[data-test-id=database-record]").should("have.length", 3)

      cy.get("[data-test-id=request-method]").select("DELETE")
      cy.get("[data-test-id=request-url]").type("/users/1")
      cy.get("[data-test-id=send-request]").click()
      cy.get("[data-test-id=response-code]").should("contain", "204")

      cy.get("[data-test-id=database-record]").should("have.length", 2)
    })
  })
})
