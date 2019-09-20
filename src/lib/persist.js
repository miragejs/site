import server from "../server"

// secret stuff in here.

// increase this number to bust all locally stored mirage
// databases
let currentVersion = 4

let resetDb
let loadDb

// This is browser code
if (typeof window !== "undefined") {
  let initialData = server.db.dump()
  let originalHandled = server.pretender.handledRequest

  let saveDb = function() {
    localStorage.setItem("mirage:db:version", currentVersion)
    localStorage.setItem("mirage:db:data", JSON.stringify(server.db.dump()))
  }

  resetDb = function(data = initialData) {
    server.db.emptyData()
    server.db.loadData(data)
    saveDb()
  }

  loadDb = function() {
    let version = localStorage.getItem("mirage:db:version")
    let dataString = localStorage.getItem("mirage:db:data")

    if (dataString && version === currentVersion.toString()) {
      try {
        resetDb(JSON.parse(dataString))
      } catch (e) {}
    }

    server.pretender.handledRequest = function() {
      originalHandled.call(server.pretender, ...arguments)
      saveDb()
    }
  }
} else {
  resetDb = () => {}
  loadDb = () => {}
}

export { loadDb, resetDb }
