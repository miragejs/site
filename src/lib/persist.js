// secret stuff in here.

// increase this number to bust all locally stored mirage
// databases
let currentVersion = 4
let initialData

function saveDb(server) {
  localStorage.setItem("mirage:db:version", currentVersion)
  localStorage.setItem("mirage:db:data", JSON.stringify(server.db.dump()))
}

export function addPersist(server) {
  if (typeof window !== "undefined") {
    initialData = server.db.dump()
    let version = localStorage.getItem("mirage:db:version")
    let dataString = localStorage.getItem("mirage:db:data")

    if (dataString && version === currentVersion.toString()) {
      try {
        resetDb(server, JSON.parse(dataString))
      } catch (e) {}
    }

    let originalHandled = server.pretender.handledRequest
    server.pretender.handledRequest = function () {
      originalHandled.call(server.pretender, ...arguments)
      saveDb(server)
    }
  }
}

export function resetDb(server, data = initialData) {
  server.db.emptyData()
  server.db.loadData(data)
  saveDb(server)
}
