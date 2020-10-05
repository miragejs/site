```js
import React from "react"
import { createServer } from "miragejs"

createServer({
  routes() {
    // 👇 mock out "some-endpoint" here
  },
})

export default function () {
  let [result, setResult] = React.useState({ text: "static" })

  React.useEffect(() => {
    fetch("/some-endpoint")
      .then((res) => res.json())
      .then(setResult)
  }, [])

  return <p>Result: {result.text}</p>
}
```
