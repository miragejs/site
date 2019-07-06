import React, { useState, useEffect } from "react"

function App() {
  let [users, setUsers] = useState([])

  useEffect(() => {
    // API not ready
    // fetch('/api/users')
    //   .then(response => response.json())
    //   .then(json => setUsers(json.data));

    // Use dummy data for now
    setUsers([
      { id: "1", name: "Luke" },
      { id: "2", name: "Leah" },
      { id: "3", name: "Anakin" },
    ])
  })

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
