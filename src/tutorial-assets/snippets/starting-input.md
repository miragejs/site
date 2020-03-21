```js
import { Server, Model, belongsTo } from "miragejs"

export default new Server({
  models: {
    user: Model,
    message: Model.extend({
      user: belongsTo(),
    }),
  },

  seeds(server) {
    server.create("user", { name: "Ryan" })
    server.create("user", { name: "Sam" })
  },

  routes() {
    this.resource("user")
  },
})
```
