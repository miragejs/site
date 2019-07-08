# Build a production-ready frontend, even if your API’s not ready.

Mirage.js is an API mocking library that lets you build, test and share a complete working JavaScript application without having to rely on any backend services.

Sign up and be the first to hear about our public release!

## Have you ever worked on a React or Vue app and needed to use a backend API that wasn’t ready?

If so, how'd you handle it?

Maybe you created some JavaScript data directly in your app, just to keep you moving:

```js
let [users, setUsers] = useState([])

useEffect(() => {
  // API not ready yet
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
```

Seems harmless enough.

Weeks later, the server’s ready and you wire up your app – but nothing works like it did during development.

Some screens flash with missing data, others are broken entirely, and worst of all, you have no idea how much of your code needs to be rewritten.

## The network is a huge part of your code

The thing is, the network is a huge part of your application. You can't just put it off until the end - its fundamental complexity that needs to be dealt with from the start.

But your development environment poked too many holes in reality.

Think about everything that goes into dealing with the network: loading states, error states, what happens if a user leaves a page in the middle of a data request, and _so_ much more. All this stuff fell on your plate after you wrote your app.

And because of that, the code you wrote wasn't ready for production.

## What if there was a better way?

What if you could use mock data, but access that mock data over the network, the same way your app will access data in production? That way you would see http codes, headers, responses, etc.

With Mirage.js, you can.

Here's what it looks like:

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

**Mirage is a server that runs in the browser**. Its code lives right alongside the rest of your frontend JavaScript.

Once it starts, Mirage will intercept any network request your app makes and respond with some data, just like a real server would.

You can tweak things like latency, error codes, HTTP headers, and more. Mirage even has an in-memory database that lets you persist data too. And you can write tests against all this functionality.

With Mirage, you can see exactly how your app will behave in its production environment.

## Live demo

Here's a complete working Todo app built with React and Mirage.

[ demo ]

The best part about this is from the React app's point of view, it's making network requests, and dealing with errors and latency, which means it's ready to be deployed.

---

Interested in Mirage and the frontend-first workflow?

Sign up and be the first to hear about our public release!
