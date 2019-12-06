```jsx
// src/App.js
import { useState, useEffect } from "react"

export default function App() {
  let [users, setUsers] = useState([])
  let [serverError, setServerError] = useState()

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          setServerError(json.error)
        } else {
          setUsers(json.users)
        }
      })
  }, [])

  return serverError ? (
    <div data-testid="server-error">{serverError}</div>
  ) : users.length === 0 ? (
    <p data-testid="no-users">No users!</p>
  ) : (
    <ul data-testid="users">
      {users.map(user => (
        <li key={user.id} data-testid={`user-${user.id}`}>
          {user.name}
        </li>
      ))}
    </ul>
  )
}
```
