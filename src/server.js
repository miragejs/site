import { Server } from "@miragejs/server"

if (Server) {
  new Server({
    baseConfig() {
      this.passthrough() // Let unhandled requests pass through Mirage

      this.namespace = "api"
      this.timing = 2000

      this.get("/todos", ({ db }) => {
        return db.todos
      })

      this.post("/todos", ({ db }) => {
        return db.todos.insert()
      })

      // this.get("/todos", ({ db }) => {
      //   return db.todos
      // })
    },

    fixtures: {
      todos: [
        { text: "Play with Legos", done: true },
        { text: "Draw on iPad", done: false },
        { text: "Build an app", done: false },
      ],
    },
  })
}
