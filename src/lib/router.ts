const allRoutes: RouteDefinition[] = [
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

interface RouteDefinition {
  label: string
  name: string
  path?: string
  routes?: RouteDefinition[]
}

interface Route {
  label: string
  name: string
  fullName: string
  path: string
  fullPath: string
  routes: Routes
}

type Routes = Route[]

export class Router {
  private _flattenedRoutes: Routes

  activePath: String
  routes: Route[]
  rootRouter: Router

  constructor(routes?: Route[], rootRouter?: Router) {
    if (routes) {
      this.routes = routes
    } else {
      this.routes = transformRoutes(allRoutes)
    }

    if (rootRouter) {
      this.rootRouter = rootRouter
    }
  }

  // Flatten all routes
  get flattenedRoutes(): Routes {
    if (!this._flattenedRoutes) {
      function flatten(routes: Route[]) {
        return routes.reduce((flattenedRoutes, { routes, ...rest }) => {
          return [
            ...flattenedRoutes,
            ...(routes.length > 0 ? flatten(routes) : rest),
          ]
        }, [])
      }

      this._flattenedRoutes = flatten(this.routes)
    }

    return this._flattenedRoutes
  }

  // Return the active route
  get activeRoute(): Route {
    if (this.rootRouter) {
      return this.rootRouter.activeRoute
    } else {
      return this.flattenedRoutes.find(route => {
        return route.fullPath.match(this.activePath.replace(/\/+$/, ""))
      })
    }
  }

  // Return the previous route
  get previousRoute(): Route {
    let match = this.flattenedRoutes.find(
      route => route.fullName === this.activeRoute.fullName
    )

    if (match) {
      let currentIndex = this.flattenedRoutes.indexOf(match)
      let hasPreviousRoute = currentIndex > 0

      return hasPreviousRoute && this.flattenedRoutes[currentIndex - 1]
    }
  }

  // Return the next route
  get nextRoute(): Route {
    let match = this.flattenedRoutes.find(
      route => route.fullName === this.activeRoute.fullName
    )

    if (match) {
      let currentIndex = this.flattenedRoutes.indexOf(match)
      let hasNextRoute = currentIndex < this.flattenedRoutes.length

      return hasNextRoute && this.flattenedRoutes[currentIndex + 1]
    }
  }

  // Return a subtree of routes under a path
  routerFor(fullPath: string) {
    let routesForSubtree = this.routes.find(
      route => route.fullPath === fullPath
    ).routes

    return new Router(routesForSubtree, this)
  }
}
