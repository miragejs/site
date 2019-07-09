# Build a production-ready frontend, even if your API’s not ready.

Mirage.js is an API mocking library that lets you build, test and share a complete working JavaScript application without having to rely on any backend services.

Sign up and be the first to hear about our public release!

## Have you ever worked on a React or Vue app and needed to use a backend API before it was ready?

If so, how'd you handle it?

Maybe you created some local mock JavaScript data directly in your app, just to keep you moving:

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

How did this happen?

## You ignored the network for too long

Here's the thing: the network is a **huge** part of your application. You can't just put it off until the end of your project – it's fundamental complexity that needs to be dealt with from the start.

Think about everything that goes into dealing with the network: loading and error states, fetching partial data and caching... not to mention how asynchronous APIs like network requests make your user flows way more complex. For example, what happens if a user transitions to a new a page in the middle of a data request?

All this stuff fell on your plate after you had already written a ton of code. But your local mock data setup poked too many holes in reality.

Because of that, the code you wrote wasn't ready for production.

## What if there was a better way?

What if you could still mock your own data, but ensure that your app would always access that mock data over the network, the same way it would access real server data in production?

That way, all of the networking issues from above - loading and error states, data caching, complex async user flows - would be front-and-center starting with your first line of code.

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

Once it starts, Mirage will intercept any network request your app makes and respond with its data, just like a real server would.

And Mirage lets you handle responses with as much flexibility and power as a real server has. You can tweak things like latency, error codes and HTTP headers. Mirage even has an in-memory database that lets you persist data too. And the kicker is, you can write front-end tests against all this functionality.

Mirage lets you build a feature-complete frontend app, and see exactly how it will behave in its production environment.

## Live demo

Here's a complete working Todo app built with React and Mirage.

[ demo ]

The best part about this is from the React app's point of view, it's making network requests, and dealing with errors and latency, which means it's ready to be deployed.

---

Interested in Mirage and the frontend-first workflow?

Sign up and be the first to hear about our public release!
