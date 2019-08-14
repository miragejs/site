const allRoutes = [
  {
    name: "index",
    label: "Index",
    path: "/",
  },
  {
    name: "docs",
    label: "Documentation",
    path: "/docs",
    routes: [
      {
        name: "getting-started",
        label: "Getting started",
        path: "/getting-started",
        routes: [
          {
            label: "Introduction",
            name: "introduction",
            path: "/introduction",
          },
          {
            label: "Installation",
            name: "installation",
            path: "/installation",
          },
          { label: "Usage", name: "usage", path: "/usage" },
        ],
      },
    ],
  },
  {
    label: "API",
    name: "api",
    path: "/api",
    routes: [
      {
        label: "Main section",
        name: "main",
        path: "/main",
        routes: [
          {
            label: "Some class",
            name: "some-class",
            path: "/some-class",
          },
        ],
      },
    ],
  },
  {
    label: "Examples",
    name: "examples",
    path: "/examples",
    routes: [
      {
        label: "Main",
        name: "main",
        path: "/main",
        routes: [
          {
            label: "React",
            name: "react",
            path: "/react",
          },
          {
            label: "Vue",
            name: "vue",
            path: "/vue",
          },
        ],
      },
    ],
  },
]

export class Router {
  constructor() {
    this._routes = allRoutes
  }

  activePath = null

  // Transform _routes to include fullPath
  get routes() {
    function transformRoutes(routes = [], pathPrefix = "", namePrefix = "") {
      return routes.map(route => {
        let fullPath = `${pathPrefix}${route.path}`
        let fullName = `${namePrefix ? namePrefix + "." : ""}${route.name}`

        route.fullPath = fullPath
        route.fullName = fullName
        route.routes = transformRoutes(route.routes, fullPath, fullName)

        return route
      }, [])
    }

    return transformRoutes(this._routes)
  }

  // Flatten all routes
  get flattenedRoutes() {
    if (!this._flattenedRoutes) {
      function flatten(routes = []) {
        return routes.reduce((flattenedRoutes, { routes, ...rest }) => {
          return [...flattenedRoutes, { ...rest }, ...flatten(routes)]
        }, [])
      }

      this._flattenedRoutes = flatten(this.routes)
    }

    return this._flattenedRoutes
  }

  // Return the active route
  get activeRoute() {
    return this.flattenedRoutes.find(route => {
      return route.fullPath.match(this.activePath.replace(/\/+$/, ""))
    })
  }

  // Return the previous route
  get previousRoute() {
    let currentIndex = this.flattenedRoutes.indexOf(this.activeRoute)

    return this.flattenedRoutes[currentIndex - 1]
  }

  // Return the next route
  get nextRoute() {
    let currentIndex = this.flattenedRoutes.indexOf(this.activeRoute)

    return this.flattenedRoutes[currentIndex + 1]
  }

  // Return a subtree of routes under a path
  routesForFullPath(fullPath) {
    return this.routes.find(route => route.fullPath === fullPath).routes
  }
}
