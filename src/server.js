import { Server } from "@miragejs/server"

let server

// Gatsby runs in both Node and the browser, but we only want Mirage in the browser.
if (window) {
  server = new Server({
    fixtures: {
      todos: [
        { id: 1, text: "Learn Mirage.js" },
        { id: 2, text: "Beat God of War" },
        { id: 3, text: "Buy groceries" },
      ],
    },

    baseConfig() {
      // Tell Mirage to ignore unhandled requests to these domains
      this.passthrough("/**")
      this.passthrough("https://app.convertkit.com/**")

      this.timing = 1000
      this.namespace = "api"

      this.get("/todos", ({ db }) => {
        return db.todos
      })

      this.post("/todos", ({ db }, request) => {
        let attrs = JSON.parse(request.requestBody)

        return db.todos.insert(attrs)
      })

      this.patch("/todos/:id", ({ db }, request) => {
        let id = request.params.id
        let attrs = JSON.parse(request.requestBody)

        return db.todos.update(id, attrs)
      })

      this.del("/todos/:id", ({ db }, request) => {
        let id = request.params.id

        db.todos.remove(id)
      })
    },
  })
}

export default server
