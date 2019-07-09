# Build a production-ready frontend, even if your API’s not ready.

Mirage.js is an API mocking library that lets you build, test and share a complete working JavaScript application without having to rely on any backend services.

Sign up and be the first to hear about our public release!

## Have you ever worked on a React or Vue app and needed to use a backend API before it was ready?

If so, how'd you handle it?

Maybe you created some local mock data directly in your app, just to keep you moving:

```js
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
```

Seems harmless enough.

Weeks later, the server’s ready and you wire up your app – but nothing works like it did during development.

Some screens flash with missing data, others are broken entirely, and worst of all, you have no idea how much of your code needs to be rewritten.

How did this happen?

## You ignored the network for too long

Dealing with the network is a **huge** part of your application. You can't just put it off until the end of your project – it's fundamental complexity that needs to be dealt with from the start.

Think about everything that goes into dealing with the network: loading states, error states, fetching partial data, effective use of a cache... not to mention the fact that asynchronous APIs like network requests add a ton of new states to your app's existing user flows.

For example, what happens if a user transitions to a new a page while a pending data request is still in flight?

When you put off dealing with the network, all of these issues fall on your lap after you've already written a ton of code.

The fact is that your local mock data setup poked one too many holes in reality. And because of that, the code you wrote wasn't ready for production.

## What if you could have the best of both worlds?

What if you could still mock your data in the frontend, but ensure that the way your app accessed that data would be exactly the same way it accesses real server data in production?

That way, every line of code you write would have to consider the network, and you wouldn't get any surprises when it came time to deploy your app.

With Mirage.js, you can do exactly that. Here's what it looks like:

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

**Mirage is a server that runs in the browser**. Its code lives right alongside the rest of your frontend JavaScript code.

Once it starts, Mirage will intercept any network request your app makes and respond back with its own mock data. But from the perspective of your app, Mirage is a real server, and the code you wrote is making real network requests.

With Mirage, you'll never write throwaway code again. Your app will be ready for production from day one.

Mirage also gives you the flexibility to handle server responses with as much flexibility and power as a real server. You can tweak things like latency, error codes, and HTTP headers. Mirage even has an in-memory database that lets you persist data.

And the best part? You can write tests against all of this dynamic functionality.

## Live demo

Here's a complete working Todo app built with React and Mirage:

[ demo ]

This React app is running in your browser against a Mirage server. But from the React app's point of view, it's making network requests, dealing with errors, and handling latency. Which means this app is ready to be deployed, and interact with a real HTTP server.

---

Interested in Mirage and the frontend-first workflow?

Sign up and be the first to hear about our public release!
