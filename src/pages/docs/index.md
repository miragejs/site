---
page: homepage
---

Have you ever been working on a React or Vue app and needed to interact with an API that wasn’t ready yet?

If so, how’d you deal with it?

Maybe you created some dummy JavaScript data just so you could keep moving:

```js
import React, { useState, useEffect } from 'react';

function() {
  let [ users, setUsers ] = useState([]);

  useEffect(() => {
    // API not ready
    // fetch('/api/users')
    //   .then(response => response.json())
    //   .then(json => setUsers(json.data));

    // Use dummy data for now
    setUsers([
      { id: '1', name: 'Luke' },
      { id: '2', name: 'Leah' },
      { id: '3', name: 'Anakin' }
    ]);
  });

  return (
    <ul>
      {users.map(user =>
        <li key={user.id}>
          {user.name}
        </li>
      )}
    </ul>
  );
}
```

Seems harmless enough.

But then you realize the code you’re writing isn’t really production-ready. Your React components are rendering local data, but eventually they’ll be making asynchronous network requests and rendering from JSON.

And we all know that those are two very different worlds.

Even worse, any time your app needs to persist data back to your server, you’re kinda stuck. Your dummy data doesn’t let you easily build out and test these sorts of dynamic features.

Before you know it, you’ve spent half your time cobbling together a mock API instead of focusing on your application.

**What if there was a better way?**

What if you had a tool that embraced your frontend workflow, giving you everything you needed to build out complete, production-ready JavaScript features without having to wait on your production API?

That's exactly why Mirage.js was created.

Here’s what it looks like:

```js
import React, { useState, useEffect } from 'react';
import Server from '@miragejs/server';

// Start the Mirage server
let server = new Server();
server.get('/users', () => (
  [
    { id: '1', name: 'Luke' },
    { id: '2', name: 'Leah' },
    { id: '3', name: 'Anakin' }
  ]
));

function() {
  let [ users, setUsers ] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(json => setUsers(json));
  });

  return (
    <ul>
      {users.map(user =>
        <li key={user.id}>
          {user.name}
        </li>
      )}
    </ul>
  );
}
```

Mirage provides an Express-like API that lets you easily intercept your app’s network requests.

Because Mirage runs in the browser, you don’t need to signup for any new services or change your development workflow. Just install the package from npm, and build out fully dynamic features directly in your frontend codebase.

Mirage’s helpers go way beyond single-route mocking. By telling Mirage a bit more about your server resources, you can have a fully relational CRUD API in just a few lines of code:

```js
new Server({
  models: {
    user: Model.extends({
      posts: hasMany(),
    }),
    post: Model,
  },

  baseConfig() {
    this.resource("users")
    this.resource("posts")
  },
})
```

Mirage’s in-memory database lets you see exactly how your React or Vue app behaves as users create, edit and delete server resources over the network. And you can even write tests to verify all this dynamic behavior.

With Mirage, you’ll be writing production-ready JavaScript code no matter the state of your API. And when the API’s ready, disable Mirage, point your frontend at your real server, and bask in this new world of frontend developer delight.
