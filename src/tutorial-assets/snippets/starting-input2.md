```js
import React from "react"
import { Server } from "miragejs"

new Server({
  routes() {
    // 👇 mock out "some-endpoint" here
  },
})

export default function() {
  let [result, setResult] = React.useState({ text: "static" })

  React.useEffect(() => {
    fetch("/some-endpoint")
      .then(res => res.json())
      .then(setResult)
  }, [])

  return <p>Result: {result.text}</p>
}
```
