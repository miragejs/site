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

How did this happen?

## You forgot about the network.

When you put local data directly in your app, you didn't account for the fact that your production app would be talking with a real HTTP server.

Think about everything that goes into dealing with the network: loading states, error states, what happens if a user leaves a page in the middle of a data request, and _so_ much more.

This isn't the kind of thing you can just shoehorn into your app after you've built everything else. It's fundamental complexity that needs to be dealt with from the start.

But your development environment poked too many holes in reality. Because of that, the code you wrote wasn't ready for production.

## What if you could have the best of both worlds?

What if you could get all the feedback you need to write production-ready code from day one, without giving up the freedom of working with local data?

What if you could build a complete, _tested_ JavaScript frontend, plug it into an API that someone else wrote, and have a working application?

With Mirage.js, you can.

**Mirage is a server that runs in the browser**. Its code lives right alongside the rest of your frontend JavaScript.

Once it starts, Mirage will intercept any network request your app makes and respond with some data, just like a real server would.

Here's what it looks like:

```js
import { Server } from "@miragejs/server"

let server = new Server()

server.get("/api/users", () => [
  { id: "1", name: "Luke" },
  { id: "2", name: "Leah" },
  { id: "3", name: "Anakin" },
])
```

Now, whenever your app makes a network request to `/api/users`

```js
let [users, setUsers] = useState([])

useEffect(() => {
  fetch("/api/users")
    .then(response => response.json())
    .then(json => setUsers(json.data))
})
```

Mirage will respond with this data. Which means you can see exactly how your app will behave in its production environment.

Check it out:

[ data-fetching demo ]

This demo is running entirely in your browser. The frontend code is deployable, and ready to interact with a real API.

## Persistence logic is just as easy

Normally, faking out backend logic to let your frontend persist data is even more painful than faking out data queries.

But thanks to an **in-memory database**, persisting data with Mirage is just as easy as fetching it.

```js
server.post("/api/users", ({ db, request }) => {
  let attrs = JSON.parse(request.requestBody)
  let newUser = db.users.insert(attrs)

  return newUser
})
```

The database assigns a new `id` and responds with the record, just like your real server would. And everything about the response can be customized to exactly match your production backend.

Here's a full CRUD application that lets you create, edit, and delete Todos.

[ todos demo ]

Mirage lets you see exactly how your JavaScript app behaves as users create, edit, and delete server resources over the network. You can even write tests to verify all this dynamic behavior.

Mirage embraces your frontend workflow and lets you write production-ready JavaScript no matter the state of your API.

---

Interested in Mirage and the frontend-first workflow?

Sign up and be the first to hear about our public release!
