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
        label: "Classes",
        name: "classes",
        path: "/classes",
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

type RouteDefinition = {
  label: string
  name: string
  path?: string
  routes?: RouteDefinition[]
}

export class Route {
  label: string
  name: string
  path: string

  private _activePath: string
  private _parent: Route
  private _routes: Route[]

  constructor({
    label,
    name,
    path,
    routes,
    parent,
  }: {
    label: string
    name: string
    path: string
    routes?: Route[]
    parent?: Route
  }) {
    this.label = label
    this.name = name
    this.path = path

    this.routes = routes ? routes : []

    if (parent) {
      this.parent = parent
    }
  }

  get fullName(): string {
    return [this.parent && this.parent.fullName, this.name]
      .filter(part => part && part !== "")
      .join(".")
  }

  get fullPath(): string {
    return [this.parent && this.parent.fullPath, this.path]
      .filter(part => part && part !== "")
      .join("")
  }

  get parent(): Route {
    return this._parent
  }

  set parent(parent: Route) {
    this._parent = parent
    if (!parent.routes.includes(this)) {
      parent.routes.push(this)
    }
  }

  private get routes(): Route[] {
    return this._routes
  }

  private set routes(routes: Route[]) {
    // if we're ever going to remove routes we should address that here
    this._routes = routes
    routes.forEach(route => {
      if (route.parent && route.parent !== this) {
        throw new Error(
          `Cannot add ${route.fullName} to ${this.fullName}, because it already belongs to ${route.parent.fullName}`
        )
      }
      route.parent = this
    })
  }

  private get allRoutes(): Route[] {
    let flatten = function(routes: Route[]) {
      return routes.reduce((result, route) => {
        return [...result, ...[route], ...flatten(route.routes)]
      }, [])
    }

    return flatten(this.routes)
  }

  get pages(): Route[] {
    return this.allRoutes.filter(route => route.routes.length === 0)
  }

  get activePath(): string {
    return this.parent ? this.parent.activePath : this._activePath
  }

  set activePath(path: string) {
    if (this.parent) {
      throw "activePath can only be set on the router, not a child route"
    } else {
      this._activePath = path
    }
  }

  // Return the active route
  get activePage(): Route {
    return this.pages.find(route => {
      return route.fullPath.match(this.activePath.replace(/\/+$/, ""))
    })
  }

  // Return the previous route
  get previousPage(): Route | undefined {
    let match =
      this.activePage &&
      this.pages.find(route => route.fullName === this.activePage.fullName)

    let currentIndex = match && this.pages.indexOf(match)
    let hasPreviousPage = match && currentIndex > 0
    return hasPreviousPage ? this.pages[currentIndex - 1] : undefined
  }

  // Return the next route
  get nextPage(): Route | undefined {
    let match =
      this.activePage &&
      this.pages.find(route => route.fullName === this.activePage.fullName)

    let currentIndex = match && this.pages.indexOf(match)
    let hasNextPage = match && currentIndex < this.pages.length
    return hasNextPage ? this.pages[currentIndex + 1] : undefined
  }

  // Return a subtree of routes under a path
  routerFor(fullPath: string): Router {
    return this.allRoutes.find(route => route.fullPath === fullPath)
  }

  add(definition: RouteDefinition): Route {
    let route = new Route({
      label: definition.label,
      name: definition.name,
      path: definition.path,
    })

    if (definition.routes && definition.routes.length > 0) {
      definition.routes.map(childDefinition => route.add(childDefinition))
    }

    route.parent = this

    return route
  }

  find(search: {
    label: string
    name: string
    fullName: string
    path: string
    fullPath: string
  }): Route | undefined {
    let keys = Object.keys(search)
    return this.allRoutes.find(route =>
      keys.every(key => search[key] === route[key])
    )
  }

  has(search: {
    label: string
    name: string
    fullName: string
    path: string
    fullPath: string
  }): boolean {
    return !!this.find(search)
  }
}

// A router is a pathless route that works with definitions
export class Router extends Route {
  constructor(definitions: RouteDefinition[] = allRoutes) {
    super({ name: "", label: "", path: "" })
    definitions.forEach(definition => this.add(definition))
  }
}
