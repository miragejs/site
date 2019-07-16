import { Server } from "@miragejs/server"

// increase this number to bust all locally stored mirage
// databases
let currentVersion = 2

let createdAt = new Date().getTime()
let initialData = {
  todos: [
    { id: 1, text: "Buy groceries", createdAt },
    { id: 2, text: "Beat God of War", createdAt },
    { id: 3, text: "Learn Mirage.js", createdAt },
  ],
}

let saveDb = function(db) {
  localStorage.setItem("mirage:db:version", currentVersion)
  localStorage.setItem("mirage:db:data", JSON.stringify(db.dump()))
}

let resetDb = function(db) {
  server.db.emptyData()
  server.db.loadData(initialData)
  saveDb(db)
}

let server

if (Server) {
  let db
  let version = localStorage.getItem("mirage:db:version")
  let data = localStorage.getItem("mirage:db:data")

  if (data && version === currentVersion.toString()) {
    try {
      db = JSON.parse(data)
    } catch (e) {}
  }

  if (!db) {
    db = initialData
  }

  // this function wraps a mirage route handler and persits the
  // database after the route handler runs.
  let persisted = function(handler) {
    return (...args) => {
      let db = args[0].db
      let value = handler.call(null, ...args)
      saveDb(db)
      return value
    }
  }

  server = new Server({
    fixtures: db,

    baseConfig() {
      // Tell Mirage to ignore unhandled requests to these domains
      this.passthrough("/**")
      this.passthrough("https://app.convertkit.com/**")

      this.timing = 1000
      this.namespace = "api"

      this.get("/todos", ({ db }) => {
        return db.todos.sort(todo => todo.createdAt).reverse()
      })

      this.post(
        "/todos",
        persisted(({ db }, request) => {
          let attrs = JSON.parse(request.requestBody)

          return db.todos.insert(attrs)
        })
      )

      this.patch(
        "/todos/:id",
        persisted(({ db }, request) => {
          let id = request.params.id
          let attrs = JSON.parse(request.requestBody)

          return db.todos.update(id, attrs)
        })
      )

      this.del(
        "/todos/:id",
        persisted(({ db }, request) => {
          let id = request.params.id

          db.todos.remove(id)
        })
      )
    },
  })

  window.server = server
}

export default server
export { resetDb }
