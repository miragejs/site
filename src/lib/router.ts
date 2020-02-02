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
        name: "main-concepts",
        label: "Main concepts",
        routes: [
          { label: "Route handlers", name: "route-handlers" },
          { label: "Shorthands", name: "shorthands" },
          { label: "The Database", name: "database" },
          { label: "The ORM", name: "orm" },
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
      {
        name: "comparison-with-other-tools",
        label: "Comparison with other tools",
      },
      {
        name: "about",
        label: "About",
      },
    ],
  },
  {
    label: "API",
    name: "api",
    routes: [
      {
        label: "Classes",
        name: "classes",
        routes: [
          {
            label: "Class",
            name: "class",
            path: "/:classSlug",
          },
        ],
      },
    ],
  },
  {
    label: "Quickstarts",
    name: "quickstarts",
    routes: [
      { label: "Overview", name: "overview" },
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
          { label: "Production builds", name: "exclude-from-production" },
        ],
      },
      { label: "Ember", name: "ember" },
      { label: "Cypress", name: "cypress" },
      {
        label: "React Native",
        name: "react-native",
        routes: [
          {
            label: "React Native Testing Library",
            name: "react-native-testing-library",
          },
        ],
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

  errors: object = {
    NOT_FOUND: new Error("Route not found"),
  }

  private _activeUrl: string
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

  get url(): string {
    if (!this.isPage) {
      throw new Error(
        `This route (${this.fullName}) is not a page and therefore has no url`
      )
    }

    return ensureTrailingSlash(this.fullPath)
  }

  get isDynamic(): boolean {
    return this.path.includes(":") || this.path.includes("*")
  }

  get isPage(): boolean {
    return this.routes.length === 0
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

  get allRoutes(): Route[] {
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

  get activeUrl(): string {
    return this.parent ? this.parent.activeUrl : this._activeUrl
  }

  set activeUrl(path: string) {
    if (this.parent) {
      throw new Error(
        "activeUrl can only be set on the router, not a child route"
      )
    } else {
      this._activeUrl = ensureTrailingSlash(path)
    }
  }

  matches(path: string) {
    let tail = str => str.substr(1)
    let after = (str: string, char: string) =>
      str.includes(char) ? str.substr(str.indexOf(char) + 1) : ""

    function match(dynamic: string, fixed: string) {
      // we're at the end of both strings without errors, we're done!
      if (dynamic.length === 0 && fixed.length === 0) {
        return true
      }

      // if we're in a wildcard we're done
      if (dynamic[0] === "*") {
        return true
      }

      // if we only have a trailing slash left we can safely ignore it
      if (dynamic.length === 0 && fixed.length === 1 && fixed[0] === "/") {
        return true
      }

      // we're about to start a dynamic segment, but there is no fixed route left
      if (dynamic[1] === ":" && !fixed[1]) {
        return false
      }

      // we're in a dynamic segment and we finished reading the fixed route
      if (dynamic[0] === ":" && fixed.length === 0) {
        return match(after(dynamic, "/"), fixed)
      }

      // we're in a dynamic segment that hasn't ended
      if (dynamic[0] === ":" && fixed[0] !== "/") {
        return match(dynamic, tail(fixed))
      }

      // we're in a dynamic segment that just ended
      if (dynamic[0] === ":" && fixed[0] === "/") {
        return match(after(dynamic, "/"), tail(fixed))
      }

      // the routes are matching so far
      if (dynamic[0] === fixed[0]) {
        return match(tail(dynamic), tail(fixed))
      }

      // the routes don't match
      return false
    }

    if (path.match(/:|\*/)) {
      throw new Error(
        `Cannot match ${path}, it needs to be a valid URL with no dynamic or wildcard segments`
      )
    }

    return match(this.fullPath, path)
  }

  // pojo mapping dynamic segments to values
  get params(): object {
    let extract = function(dynamic, fixed, params = {}) {
      if (dynamic.length === 0 && fixed.length === 0) {
        return params
      }

      if (dynamic[0] === ":") {
        let dynamicTerminateChar = dynamic.includes("/") ? "/" : null
        let fixedTerminateChar = fixed.includes("/") ? "/" : null
        let dynamicEnd = dynamicTerminateChar
          ? dynamic.indexOf(dynamicTerminateChar)
          : dynamic.length
        let fixedEnd = fixedTerminateChar
          ? fixed.indexOf(fixedTerminateChar)
          : fixed.length

        let key = dynamic.substr(1, dynamicEnd - 1)
        let value = fixed.substr(0, fixedEnd)

        return extract(dynamic.substr(dynamicEnd), fixed.substr(fixedEnd), {
          ...params,
          [key]: value,
        })
      }

      if (dynamic[0] === fixed[0]) {
        return extract(dynamic.substr(1), fixed.substr(1), params)
      }

      // there was an error
      return params
    }

    return extract(this.fullPath, this.activeUrl)
  }

  // generate a url replacing the dynamic segments with the passed in params
  buildUrl(params: object = {}): string {
    return ensureTrailingSlash(
      Object.keys(params).reduce((url, key) => {
        return url.replace(`:${key}`, params[key])
      }, this.fullPath)
    )
  }

  // Return the active page
  get activePage(): Route {
    return this.pages.find(route => route.matches(this.activeUrl))
  }

  // Return the active route
  get activeRoute(): Route {
    return this.allRoutes.find(route => route.matches(this.activeUrl))
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

function ensureTrailingSlash(path) {
  return path.replace(/\/?$/, "/")
}
