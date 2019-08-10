export default class {
  // _routes = [
  //   {
  //     name: "Index",
  //     path: "/",
  //     component: "index",
  //   },
  //   {
  //     name: "Documentation",
  //     path: "docs",
  //     component: "docs",
  //   },
  // ]

  _routes = [
    {
      id: "index",
      name: "Index",
      path: "/",
    },
    {
      id: "docs",
      name: "Documentation",
      path: "docs",
      routes: [
        {
          id: "getting-started",
          name: "Getting started",
          path: "getting-started",
          routes: [
            { name: "Introduction", id: "introduction", path: "introduction" },
            { name: "Installation", id: "installation", path: "installation" },
            { name: "Usage", id: "usage", path: "usage" },
          ],
        },
        {
          id: "examples",
          path: "examples",
          name: "Examples",
          routes: [
            { name: "React", id: "react", path: "react" },
            { name: "Vue", id: "vue", path: "vue" },
          ],
        },
      ],
    },
    {
      name: "Examples",
      path: "examples",
    },
  ]

  constructor(activePath) {
    this.activePath = activePath
  }

  // Transform _routes to include fullPath
  get routes() {
    function transformRoutes(routes = [], prefix = "") {
      return routes.map(route => {
        let fullPath = `${prefix}/${route.path}`

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
      return routes.reduce((flattenedRoutes, { routes, ...rest }) => {
        return [...flattenedRoutes, { ...rest }, ...flatten(routes)]
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
  routesForFullPath(fullPath) {
    return this.routes.find(route => route.fullPath === fullPath).routes
  }
}
