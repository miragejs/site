```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="demo"></div>
    <script src="https://unpkg.com/@plnkr/runtime@1.0.0-pre.9/dist/runtime.js"></script>
    <script>
      const files = {
        "package.json": JSON.stringify({
          dependencies: {
            react: "16.x",
            "react-dom": "16.x",
            miragejs: "*",
          },
        }),

        "index.js": `
          import React from 'react';
          import ReactDOM from 'react-dom';
          import App from './App';

          ReactDOM.render(<App />, document.getElementById('demo'));
        `,

        "App.js": `
        `,
      }
      const host = {
        getCanonicalPath(path) {
          if (files[path]) return path
          if (files[`${path}.js`]) return `${path}.js`
          return Promise.reject(new Error(`File not found ${path}`))
        },
        getFileContents(canonicalPath) {
          return files[canonicalPath]
        },
      }
      const PlnkrRuntime = window.PlnkrRuntime
      const runtime = new PlnkrRuntime.Runtime({ host })

      window.myOnError = function(e) {
        window.top.postMessage(
          { fromRepl: true, type: "runtimeError", message: e },
          "*"
        )
      }

      window.addEventListener("unhandledrejection", function(e) {
        e.stopImmediatePropagation()
        e.preventDefault()

        window.top.postMessage(
          {
            fromRepl: true,
            type: "runtimeError",
            message: e.reason,
          },
          "*"
        )
      })

      const log = console.log.bind(console)
      console.log = (...args) => {
        log(...args)
        window.top.postMessage(
          {
            fromRepl: true,
            type: "log",
            message: args,
          },
          "*"
        )
      }

      const groupCollapsed = console.groupCollapsed.bind(console)
      console.groupCollapsed = (...args) => {
        groupCollapsed(...args)
        window.top.postMessage(
          {
            fromRepl: true,
            type: "log",
            message: args,
          },
          "*"
        )
      }

      runtime
        .import("./index.js")
        .then(() => {
          window.top.postMessage(
            {
              fromRepl: true,
              type: "success",
            },
            "*"
          )
        })
        .catch(e => {
          window.top.postMessage(
            {
              fromRepl: true,
              type: "error",
              message: e,
            },
            "*"
          )
        })
    </script>
  </body>
</html>
```
