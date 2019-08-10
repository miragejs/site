import RoutesService from "../lib/routes-service"
import React from "react"
import { Router, Link } from "@reach/router"

const cache = {}

function importAll(r) {
  r.keys().forEach(key => (cache[key] = r(key)))
}

importAll(require.context("../routes/", true, /\.js$/))

export default function(props) {
  let routesService = new RoutesService(props.path)

  return (
    <div>
      <header>
        <ul>
          <li>
            <Link to="/">Home</Link>
            <Link to="/docs">Docs</Link>
          </li>
        </ul>
      </header>

      <div>
        <input type="text" />
      </div>

      <Router>
        {routesService.flattenedRoutes.map(route => {
          let Component = cache[`./${route.component}.js`].default

          return <Component path={route.fullPath} key={route.fullPath} />
        })}
      </Router>
    </div>
  )
}
