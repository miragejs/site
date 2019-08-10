export default class {
  _routes = [
    {
      name: "Documentation",
      path: "/docs",
      routes: [
        {
          path: "/getting-started",
          name: "Getting started",
          routes: [
            { name: "Introduction", path: "/introduction" },
            { name: "Installation", path: "/installation" },
            { name: "Usage", path: "/usage" },
          ],
        },
        {
          path: "/examples",
          name: "Examples",
          routes: [
            { name: "React", path: "/react" },
            { name: "Vue", path: "/vue" },
          ],
        },
      ],
    },
    {
      name: "Examples",
      path: "/examples",
    },
  ]

  constructor(activePath) {
    this.activePath = activePath
  }

  // Transform _routes to include fullPath
  get routes() {
    function transformRoutes(routes = [], prefix = "") {
      return routes.map(route => {
        let fullPath = `${prefix}${route.path}`

        route.fullPath = fullPath
        route.routes = transformRoutes(route.routes, fullPath)

        return route
      }, [])
    }

    return transformRoutes(this._routes)
  }

  // Flatten all routes
  get flattenedRoutes() {
    function flatten(routes = []) {
      return routes.reduce((flattenedRoutes, { name, fullPath, routes }) => {
        return [...flattenedRoutes, { name, fullPath }, ...flatten(routes)]
      }, [])
    }

    return flatten(this.routes)
  }

  // Return the active route
  get activeRoute() {
    return this.flattenedRoutes.find(route => {
      return route.fullPath.match(this.activePath.replace(/\/+$/, ""))
    })
  }

  // Return a subtree of routes under a path
  routesForPath(path) {
    return this.routes.find(route => route.path === "/docs").routes
  }
}
