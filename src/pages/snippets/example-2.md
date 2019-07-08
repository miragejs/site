```js
import React, { useState, useEffect } from "react"
import { Server } from "@miragejs/server"

// Start the Mirage server
let server = new Server({
  baseConfig() {
    this.passthrough()
  },
})
server.get("/users", () => [
  { id: "1", name: "Luke" },
  { id: "2", name: "Leah" },
  { id: "3", name: "Anakin" },
])

export function App() {
  let [users, setUsers] = useState([])

  useEffect(() => {
    fetch("/api/users")
      .then(response => response.json())
      .then(json => setUsers(json))
  })

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```
