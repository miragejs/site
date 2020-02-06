import { Route, Router } from "../../lib/router"

describe("Router", () => {
  describe("constructor", () => {
    it("can take a list of router definitions", () => {
      let router = new Router([
        {
          name: "people",
          label: "people",
          path: "/people",
          routes: [
            { name: "ryan", path: "/ryan", label: "ryan" },
            { name: "sam", path: "/sam", label: "sam" },
          ],
        },
      ])

      expect(router.has({ fullPath: "/people" })).toBeTruthy()
      expect(router.has({ fullPath: "/people/ryan" })).toBeTruthy()
      expect(router.has({ fullPath: "/people/sam" })).toBeTruthy()
    })
  })

  describe("constructor", () => {
    it("works with RouteDefinitions that have no path", () => {
      let router = new Router([
        {
          name: "people",
          label: "people",
          routes: [{ name: "ryan", label: "ryan" }],
        },
      ])

      expect(router.has({ fullPath: "/people" })).toBeTruthy()
      expect(router.has({ fullPath: "/people/ryan" })).toBeTruthy()
    })
  })
})

describe("Route", () => {
  describe("construtor", () => {
    it("should be able to pass a parent route, and be added to that routes children", () => {
      let parent = new Route({ label: "parent", name: "parent", path: "" })
      let child = new Route({
        label: "child",
        name: "child",
        path: "/child",
        parent,
      })

      expect(parent.routes).toContain(child)
    })

    it("should be able to pass child routes, and become those routes parents", () => {
      let child = new Route({
        label: "child",
        name: "child",
        path: "/child",
      })
      let parent = new Route({
        label: "parent",
        name: "parent",
        path: "",
        routes: [child],
      })

      expect(child.parent).toBe(parent)
    })

    it("should be able to pass both a parent and child routes, and link everything together", () => {
      let grandparent = new Route({
        label: "grandparent",
        name: "grandparent",
        path: "/",
      })

      let child = new Route({
        label: "child",
        name: "child",
        path: "/child",
      })

      new Route({
        label: "parent",
        name: "parent",
        path: "/parent",
        parent: grandparent,
        routes: [child],
      })

      expect(child.parent.parent).toBe(grandparent)
      expect(grandparent.routes[0].routes).toContain(child)
    })

    it("should error if given a child route that already has a parent", () => {
      let child = new Route({
        label: "child",
        name: "child",
        path: "/child",
      })
      let parent = new Route({
        label: "parent1",
        name: "parent1",
        path: "/",
        routes: [child],
      })

      expect(() => {
        new Route({
          label: "thief",
          name: "thief",
          routes: [child],
        })
      }).toThrow()

      expect(child.parent).toBe(parent)
    })

    it("should not error if trying to create a circular parent/child relationship that exists", () => {
      let parent = new Route({
        label: "parent1",
        name: "parent1",
        path: "/",
      })
      let child = new Route({
        label: "child",
        name: "child",
        path: "/child",
        parent,
      })

      parent.routes = [child]
    })
  })

  describe("fullName", () => {
    it("Roots have the same fullName as their name", () => {
      let route = new Route({ label: "label", name: "name", path: "/" })
      expect(route.fullName).toBe("name")
    })

    it("A childs full name is its parent's fullName and its name", () => {
      let parent = new Route({ label: "parent", name: "parent", path: "" })
      let route = new Route({
        label: "label",
        name: "name",
        path: "/child",
        parent,
      })
      expect(route.fullName).toBe("parent.name")
    })
  })

  describe("fullPath", () => {
    it("Roots have the same fullPath as their path", () => {
      let route = new Route({ label: "label", name: "name", path: "/" })
      expect(route.fullPath).toBe("/")
    })

    it("A childs full name is its parent's fullPath and its fullPath", () => {
      let parent = new Route({
        label: "parent",
        name: "parent",
        path: "/path1",
      })
      let route = new Route({
        label: "label",
        name: "name",
        path: "/path2",
        parent,
      })
      expect(route.fullPath).toBe("/path1/path2")
    })
  })

  describe("isDynamic", () => {
    it("is false if the path has no dynamic segment", () => {
      let route = new Route({ label: "label", name: "name", path: "/home" })
      expect(route.isDynamic).toBe(false)
    })

    it("is true if the path has a dynamic segment", () => {
      let route = new Route({ label: "label", name: "name", path: "/:post_id" })
      expect(route.isDynamic).toBe(true)
    })

    it("is true if the path has a wildcard segment", () => {
      let route = new Route({ label: "label", name: "name", path: "/*" })
      expect(route.isDynamic).toBe(true)
    })
  })

  describe("pages", () => {
    it("only contains leaf nodes", () => {
      let root = new Route({
        label: "root",
        name: "root",
        path: "/root",
      })
      let parent1 = new Route({
        label: "parent1",
        name: "parent1",
        path: "/parent1",
        parent: root,
      })
      let parent2 = new Route({
        label: "parent2",
        name: "parent2",
        path: "/parent2",
        parent: root,
      })
      let child1 = new Route({
        label: "child1",
        name: "child1",
        path: "/child1",
        parent: parent1,
      })
      let child2 = new Route({
        label: "child2",
        name: "child2",
        path: "/child2",
        parent: parent1,
      })
      let child3 = new Route({
        label: "child3",
        name: "child3",
        path: "/child3",
        parent: parent2,
      })
      let child4 = new Route({
        label: "child4",
        name: "child4",
        path: "/child4",
        parent: parent2,
      })

      expect(root.pages).toContain(child1)
      expect(root.pages).toContain(child2)
      expect(root.pages).toContain(child3)
      expect(root.pages).toContain(child4)
      expect(root.pages).not.toContain(parent1)
      expect(root.pages).not.toContain(parent2)
      expect(root.pages).not.toContain(root)
    })
  })

  describe("activePath", () => {
    it("should get the active path from the parent", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })
      let child = new Route({
        name: "child",
        label: "child",
        path: "/child",
        parent: router,
      })

      router.activePath = "/root/child"

      expect(child.activePath).toBe("/root/child")
    })

    it("should only be able to set an active path on the parent", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })
      let child = new Route({
        name: "child",
        label: "child",
        path: "/child",
        parent: router,
      })

      expect(() => {
        child.activePath = "/root/child"
      }).toThrow()
    })
  })

  describe("activePage", () => {
    it("will find the active route based on its path", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })
      let child = new Route({
        name: "child",
        label: "child",
        path: "/child",
        parent: router,
      })

      router.activePath = "/root/child"

      expect(router.activePage).toBe(child)
    })

    it("will ignore trailing slashes", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })
      let child = new Route({
        name: "child",
        label: "child",
        path: "/child",
        parent: router,
      })

      router.activePath = "/root/child/"

      expect(router.activePage).toBe(child)
    })

    it("will not have an active route if the subtree does not have a route that matches the path", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
        routes: [
          new Route({
            name: "child1",
            label: "child1",
            path: "/child1",
          }),
        ],
      })
      let subrouter = new Route({
        name: "subroute",
        label: "subroute",
        path: "/subroute",
        parent: router,
        routes: [
          new Route({
            name: "child2",
            label: "child2",
            path: "/child2",
          }),
        ],
      })

      router.activePath = "/root/child1"

      expect(subrouter.activePage).toBeUndefined()
    })

    it("will match pages that have dynamic segments", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
        routes: [
          new Route({
            name: "child",
            label: "child",
            path: "/:name",
          }),
        ],
      })

      router.activePath = "/root/a-dynamic-segment"

      expect(router.activePage).toBe(router.routerFor("/root/:name"))
    })
  })

  describe("matches", () => {
    it("should have an empty path match", () => {
      let route = new Route({
        name: "route",
        label: "route",
        path: "",
      })

      expect(route.matches("")).toBeTruthy()
    })

    it("should have static routes match", () => {
      let route = new Route({
        name: "route",
        label: "route",
        path: "/a",
      })

      expect(route.matches("/a")).toBeTruthy()
    })

    it("should ignore trailing slashes", () => {
      let route = new Route({
        name: "route",
        label: "route",
        path: "/a",
      })

      expect(route.matches("/a/")).toBeTruthy()
    })

    it("should have static routes match the full path", () => {
      let route = new Route({
        name: "root",
        label: "root",
        path: "/root",
        routes: [
          new Route({
            name: "child",
            label: "child",
            path: "/child",
          }),
        ],
      })

      expect(route.routerFor("/root/child").matches("/root/child")).toBeTruthy()
    })

    it("should match when given a dynamic segment", () => {
      let route = new Route({
        name: "root",
        label: "root",
        path: "/root",
        routes: [
          new Route({
            name: "child",
            label: "child",
            path: "/:child",
          }),
        ],
      })

      expect(route.routerFor("/root/:child").matches("/root/bob")).toBeTruthy()
    })

    it("should match when given a dynamic segment in the middle", () => {
      let route = new Route({
        name: "posts",
        label: "posts",
        path: "/posts",
        routes: [
          new Route({
            name: "post",
            label: "post",
            path: "/:postId",
            routes: [
              new Route({
                name: "comments",
                label: "comments",
                path: "/comments",
                routes: [
                  new Route({
                    name: "comment",
                    label: "comment",
                    path: "/:commentId",
                  }),
                ],
              }),
            ],
          }),
        ],
      })

      expect(
        route
          .routerFor("/posts/:postId/comments/:commentId")
          .matches("/posts/1/comments/2")
      ).toBeTruthy()
    })

    it("should not match when only one dynamic segment matches", () => {
      let route = new Route({
        name: "posts",
        label: "posts",
        path: "/posts",
        routes: [
          new Route({
            name: "post",
            label: "post",
            path: "/:postId",
            routes: [
              new Route({
                name: "comments",
                label: "comments",
                path: "/comments",
                routes: [
                  new Route({
                    name: "comment",
                    label: "comment",
                    path: "/:commentId",
                  }),
                ],
              }),
            ],
          }),
        ],
      })

      expect(
        route
          .routerFor("/posts/:postId/comments/:commentId")
          .matches("/posts/1/author")
      ).toBeFalsy()
    })

    it("should not match when only one dynamic is provided", () => {
      let route = new Route({
        name: "posts",
        label: "posts",
        path: "/posts",
        routes: [
          new Route({
            name: "post",
            label: "post",
            path: "/:postId",
            routes: [
              new Route({
                name: "comments",
                label: "comments",
                path: "/comments",
                routes: [
                  new Route({
                    name: "comment",
                    label: "comment",
                    path: "/:commentId",
                  }),
                ],
              }),
            ],
          }),
        ],
      })

      expect(
        route
          .routerFor("/posts/:postId/comments/:commentId")
          .matches("/posts/1")
      ).toBeFalsy()
    })

    it("should not match if a dynamic segment is missing", () => {
      let route = new Route({
        name: "posts",
        label: "posts",
        path: "/posts",
        routes: [
          new Route({
            name: "post",
            label: "post",
            path: "/:postId",
          }),
        ],
      })

      expect(route.routerFor("/posts/:postId").matches("/posts/")).toBeFalsy()
    })

    it("should throw an error if we pass in a dynamic url", () => {
      let route = new Route({
        name: "posts",
        label: "posts",
        path: "/posts",
      })

      expect(() => {
        route.matches("/posts/:postId")
      }).toThrow()

      expect(() => {
        route.matches("/posts/*")
      }).toThrow()
    })

    it("should match against any wildcard paths", () => {
      let route = new Route({
        name: "catchall",
        label: "catchall",
        path: "*",
      })

      expect(route.matches("/anything")).toBeTruthy()
    })
  })

  describe("previousPage", () => {
    it("should be undefined if it is the first route", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })
      new Route({
        name: "child1",
        label: "child1",
        path: "/child1",
        parent: router,
      })
      new Route({
        name: "child2",
        label: "child2",
        path: "/child2",
        parent: router,
      })

      router.activePath = "/root/child1"

      expect(router.previousPage).toBeUndefined()
    })

    it("should be the route before the active route", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })
      let previous = new Route({
        name: "child1",
        label: "child1",
        path: "/child1",
        parent: router,
      })
      new Route({
        name: "child2",
        label: "child2",
        path: "/child2",
        parent: router,
      })

      router.activePath = "/root/child2"

      expect(router.previousPage).toBe(previous)
    })

    it("should be undefined when there's nothing active in the route tree", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
        routes: [
          new Route({
            name: "child1",
            label: "child1",
            path: "/child1",
          }),
          new Route({
            name: "child2",
            label: "child2",
            path: "/child2",
          }),
        ],
      })
      let subrouter = new Route({
        name: "subroute",
        label: "subroute",
        path: "/subroute",
        parent: router,
        routes: [
          new Route({
            name: "child2",
            label: "child2",
            path: "/child2",
          }),
        ],
      })

      router.activePath = "/root/child2"

      expect(subrouter.previousPage).toBeUndefined()
    })
  })

  describe("nextPage", () => {
    it("should be undefined if it is the last route", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })
      new Route({
        name: "child1",
        label: "child1",
        path: "/child1",
        parent: router,
      })
      new Route({
        name: "child2",
        label: "child2",
        path: "/child2",
        parent: router,
      })

      router.activePath = "/root/child2"

      expect(router.nextPage).toBeUndefined()
    })

    it("should be the route after the active route", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })
      new Route({
        name: "child1",
        label: "child1",
        path: "/child1",
        parent: router,
      })
      let next = new Route({
        name: "child2",
        label: "child2",
        path: "/child2",
        parent: router,
      })

      router.activePath = "/root/child1"

      expect(router.nextPage).toBe(next)
    })

    it("should be undefined when there's nothing active in the route tree", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
        routes: [
          new Route({
            name: "child1",
            label: "child1",
            path: "/child1",
          }),
          new Route({
            name: "child2",
            label: "child2",
            path: "/child2",
          }),
        ],
      })
      let subrouter = new Route({
        name: "subroute",
        label: "subroute",
        path: "/subroute",
        parent: router,
        routes: [
          new Route({
            name: "child2",
            label: "child2",
            path: "/child2",
          }),
        ],
      })

      router.activePath = "/root/child1"

      expect(subrouter.nextPage).toBeUndefined()
    })
  })

  describe("routerFor", () => {
    it("should return a router scoped to the path", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })

      let child1 = new Route({
        name: "child1",
        label: "child1",
        path: "/child1",
        parent: router,
      })

      new Route({
        name: "child2",
        label: "child2",
        path: "/child2",
        parent: router,
      })

      expect(router.routerFor("/root/child1")).toBe(child1)
    })

    describe("it should be able to get its routes routes'", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })

      let parent = new Route({
        name: "parent",
        label: "parent",
        path: "/parent",
        parent: router,
      })

      let child = new Route({
        name: "child",
        label: "child",
        path: "/child",
        parent: parent,
      })

      expect(router.routerFor("/root/parent/child")).toBe(child)
    })

    describe("it should be able to get non terminating routes", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })

      let parent = new Route({
        name: "parent",
        label: "parent",
        path: "/parent",
        parent: router,
      })

      new Route({
        name: "child",
        label: "child",
        path: "/child",
        parent: parent,
      })

      expect(router.routerFor("/root/parent")).toBe(parent)
    })
  })

  describe("addRoute", () => {
    it("should add a route to the router", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/",
      })

      let added = router.add({
        name: "child",
        label: "child",
        path: "/child",
      })

      expect(added.parent).toBe(router)
      expect(router.routes).toContain(added)
    })

    it("should be able to add a route with child routes", () => {
      let router = new Route({
        name: "",
        label: "root",
        path: "",
      })

      router.add({
        name: "child",
        label: "child",
        path: "/child",
        routes: [
          {
            name: "grandchild",
            label: "grandchild",
            path: "/grandchild",
          },
        ],
      })

      expect(router.has({ fullPath: "/child/grandchild" })).toBeTruthy()
    })
  })

  describe("find", () => {
    it("should find a route by its path", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })
      let route = new Route({
        name: "child1",
        label: "child1",
        path: "/child1",
        parent: router,
      })

      expect(router.find({ path: "/child1" })).toBe(route)
    })

    it("should find a route by its full path", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
      })
      let route = new Route({
        name: "child1",
        label: "child1",
        path: "/child1",
        parent: router,
      })

      expect(router.find({ fullPath: "/root/child1" })).toBe(route)
    })

    it("should not find anything", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
        routes: [
          new Route({
            name: "child1",
            label: "child1",
            path: "/child1",
          }),
        ],
      })

      expect(router.find({ fullPath: "/root/child2" })).toBeUndefined()
    })
  })

  describe("has", () => {
    it("should return true if the router has the path", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
        routes: [
          new Route({
            name: "child1",
            label: "child1",
            path: "/child1",
          }),
        ],
      })

      expect(router.has({ fullPath: "/root/child1" })).toBeTruthy()
    })

    it("should return false if the router does not have the path", () => {
      let router = new Route({
        name: "root",
        label: "root",
        path: "/root",
        routes: [
          new Route({
            name: "child1",
            label: "child1",
            path: "/child1",
          }),
        ],
      })

      expect(router.has({ fullPath: "/root/child2" })).toBeFalsy()
    })
  })
})
