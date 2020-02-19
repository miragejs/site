import React from "react"
import useApiDocs from "../../../hooks/use-api-docs"
import { H1 } from "../../../components/ui"

import { Markdown } from "../../../components/markdown"

let humanizeType = type => (type === "*" ? "any" : type)
let toJSXCommaList = (prev, curr) => [prev, ", ", curr]

const Params = function({ esdoc }) {
  return esdoc.params
    ? esdoc.params
        .map((param, index) => (
          <span key={index}>
            <span className="font-semibold">{param.name}: </span>
            <Types types={param.types} />
          </span>
        ))
        .reduce(toJSXCommaList)
    : null
}

const Returns = function({ esdoc }) {
  return <Types types={esdoc.return ? esdoc.return.types : ["any"]} />
}

const Type = function({ esdoc }) {
  return <Types types={esdoc.type ? esdoc.type.types : ["any"]} />
}

let Types = function({ types }) {
  return (
    <span className="italic">
      {types.map(humanizeType).reduce(toJSXCommaList)}
    </span>
  )
}

export default function(props) {
  let classSlug = props.classSlug
  let { publicClasses } = useApiDocs()
  let publicClass = publicClasses.find(doc => doc.slug === classSlug)

  return (
    <div>
      <H1>{publicClass.name}</H1>
      <div className="pt-2">
        <Markdown>{publicClass.description}</Markdown>
      </div>
      {publicClass.properties.length > 0 ? (
        <div>
          <h2
            id="properties"
            className="mt-12 mb-4 text-2xl font-semibold leading-tight xl:before-h-12"
          >
            <a href="#properties">Properties</a>
          </h2>
          {publicClass.properties.map(property => (
            <div key={property.longname} className="pb-4">
              <h3
                id={property.slug}
                className="mt-12 -mb-3 font-mono text-xl xl:before-h-12"
              >
                <a href={`#${property.slug}`} className="block">
                  <span className="font-semibold">{property.name}:</span>{" "}
                  <Type esdoc={property} />
                </a>
              </h3>
              <div className="text-base">
                <Markdown>{property.description}</Markdown>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {publicClass.methods.length > 0 ? (
        <div>
          <h2
            id="methods"
            className="mt-12 mb-4 text-2xl font-semibold leading-tight xl:before-h-12"
          >
            <a href="#methods">Methods</a>
          </h2>
          {publicClass.methods.map(method => (
            <div key={method.longname} className="pb-4">
              <h3
                id={method.slug}
                className="mt-12 -mb-3 font-mono text-xl xl:before-h-12"
              >
                <a href={`#${method.slug}`} className="block">
                  <span className="font-semibold">{method.name}</span>
                  (
                  <Params esdoc={method} />
                  ): <Returns esdoc={method} />
                </a>
              </h3>
              <div className="text-base">
                <Markdown>{method.description}</Markdown>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
