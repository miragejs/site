import { useStaticQuery, graphql } from "gatsby"

type EsdocNode = {
  name: string
  longname: string
  slug: string
  memberof: string
  kind: string
  description: string
  access: string
  return: null | { types: string[] }
  undocument: boolean
  unknown: null | { tagName: string }[]
}

let byName = (a: { name: string }, b: { name: string }) =>
  a.name > b.name ? 1 : -1

class ClassDoc {
  node: EsdocNode
  esdoc: EsdocNode[]

  readonly name: string
  readonly slug: string
  readonly description: string

  constructor(node: EsdocNode, esdoc: EsdocNode[]) {
    this.node = node
    this.esdoc = esdoc

    let fwd = ["name", "slug", "description"]
    fwd.forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return node[key]
        },
      })
    })
  }

  get blocks(): EsdocNode[] {
    return this.esdoc
      .filter(node => node.memberof === this.node.longname)
      .sort(byName)
  }

  get isHidden(): boolean {
    return (
      this.node.unknown &&
      this.node.unknown.some(unknown => unknown.tagName === "@hide")
    )
  }

  get public(): EsdocNode[] {
    return this.blocks.filter(node => {
      let hasHideTag =
        node.unknown &&
        node.unknown.some(unknown => unknown.tagName === "@hide")
      let isUndocumented = node.undocument

      return !hasHideTag && !isUndocumented
    })
  }

  get accessors(): EsdocNode[] {
    return this.public.filter(node => node.kind === "get")
  }

  get fields(): EsdocNode[] {
    return this.public.filter(node => node.kind === "member")
  }

  get methods(): EsdocNode[] {
    return this.public.filter(node => node.kind === "method")
  }
}

interface IApiDocsHook {
  publicClasses: ClassDoc[]
}

export default function(): IApiDocsHook {
  let data = useStaticQuery(graphql`
    fragment DocNode on ESDoc {
      name
      longname
      slug
      undocument
      memberof
      kind
      description
      access
      return {
        description
        types
      }
      unknown {
        tagName
        tagValue
      }
    }

    query DocsQuery {
      publicClasses: allEsDoc(
        filter: { access: { eq: "public" }, kind: { eq: "class" } }
      ) {
        nodes {
          ...DocNode
        }
      }
      allNodes: allEsDoc {
        nodes {
          ...DocNode
        }
      }
    }
  `)

  let esdoc: EsdocNode[] = data.allNodes.nodes

  let publicClasses = data.publicClasses.nodes
    .sort(byName)
    .map((node: EsdocNode) => new ClassDoc(node, esdoc))
    .filter(classDoc => !classDoc.isHidden)

  return {
    publicClasses,
  }
}
