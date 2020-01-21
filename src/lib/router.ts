const allRoutes: RouteDefinition[] = [
  {
    name: "index",
    label: "Index",
    path: "/",
    meta: {
      theme: "dark",
    },
  },
  {
    name: "thanks",
    label: "Thanks",
    meta: {
      theme: "dark",
    },
  },
  {
    name: "docs",
    label: "Documentation",
    routes: [
      {
        name: "getting-started",
        label: "Getting started",
        routes: [
          { label: "Introduction", name: "introduction" },
          { label: "Installation", name: "installation" },
          { label: "Overview", name: "overview" },
        ],
      },
      {
        name: "route-handlers",
        label: "Route handlers",
        routes: [
          { label: "Functions", name: "functions" },
          { label: "Shorthands", name: "shorthands" },
        ],
      },
      {
        name: "data-layer",
        label: "Data layer",
        routes: [
          { label: "The Database", name: "database" },
          { label: "Why an ORM?", name: "orm" },
          { label: "Models", name: "models" },
          { label: "Relationships", name: "relationships" },
          { label: "Factories", name: "factories" },
          { label: "Fixtures", name: "fixtures" },
          { label: "Serializers", name: "serializers" },
        ],
      },
      {
        name: "testing",
        label: "Testing",
        routes: [
          { label: "Application tests", name: "application-tests" },
          {
            label: "Integration and unit tests",
            name: "integration-and-unit-tests",
          },
          {
            label: "Assertions",
            name: "assertions",
          },
        ],
      },
      {
        name: "advanced",
        label: "Advanced",
        routes: [
          {
            label: "Simulating cookie responses",
            name: "simulating-cookie-responses",
          },
          {
            label: "Mocking GUIDs",
            name: "mocking-guids",
          },
          {
            label: "Customizing inflections",
            name: "customizing-inflections",
          },
        ],
      },
    ],
  },
  {
    label: "API",
    name: "api",
    routes: [
      {
        label: "Class",
        name: "class",
        path: "/classes/:classSlug",
      },
    ],
  },
  {
    label: "Quickstarts",
    name: "quickstarts",
    routes: [
      {
        label: "React",
        name: "react",
        routes: [
          { label: "Development", name: "development" },
          { label: "React Testing Library", name: "react-testing-library" },
        ],
      },
      {
        label: "Vue",
        name: "vue",
        routes: [
          { label: "Development", name: "development" },
          { label: "Vue Test Utils", name: "vue-test-utils" },
        ],
      },
      {
        label: "Nuxt",
        name: "nuxt",
        routes: [{ label: "Setup", name: "setup" }],
      },
      {
        label: "Angular",
        name: "angular",
        routes: [{ label: "Setup", name: "setup" }],
      },
      {
        label: "Cypress",
        name: "cypress",
        routes: [{ label: "Setup", name: "setup" }],
      },
    ],
  },
]

interface RouteDefinition {
  label: string
  name: string
  path?: string
  routes?: RouteDefinition[]
  meta?: object
}

interface RouteInfo {
  label: string
  name: string
  path: string
  meta?: object
}

interface RouteOptions extends RouteInfo {
  routes?: Route[]
  parent?: Route
}

export class Route {
  label: string
  name: string
  path: string
  meta: object

  private _activePath: string
  private _parent: Route
  private _routes: Route[]

  private _onNewRoute: CallableFunction = () => {}

  constructor(config: RouteOptions) {
    this.label = config.label
    this.name = config.name
    this.path = config.path
    this.meta = config.meta || {}

    this.routes = config.routes ? config.routes : []

    if (config.parent) {
      this.parent = config.parent
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

  get isDynamic(): boolean {
    return this.path.includes(":")
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

  get routes(): Route[] {
    return this._routes
  }

  set routes(routes: Route[]) {
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
      path:
        definition.path !== undefined ? definition.path : `/${definition.name}`,
      meta: definition.meta || {},
    })

    // i think this is recursively backwards, create parents first then children
    if (definition.routes && definition.routes.length > 0) {
      definition.routes.map(childDefinition => route.add(childDefinition))
    }

    route.parent = this

    this.didCreateRoute(route)

    return route
  }

  didCreateRoute(route: Route): void {
    this._onNewRoute(route)
    this.parent && this.parent.didCreateRoute(route)
  }

  onNewRoute(callback: (route?: Route) => void): void {
    this._onNewRoute = callback
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
