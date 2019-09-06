import React from "react"
import useApiDocs from "../../hooks/use-api-docs"
import {
  H1,
  H2,
  H3,
  P,
  UL,
  LI,
  Strong,
  A,
  Pre,
  Code,
} from "../../components/ui"
import { Markdown } from "../../components/markdown"

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
      <div className="pt-12">
        <h2 className="font-semibold text-2xl leading-tight">Accessors</h2>
        {publicClass.accessors.map(field => (
          <div key={field.longname}>
            <div className="">¶</div>
            <a href={`#${field.longname}`} className="font-mono pt-4 block">
              {field.kind} <span className="font-semibold">{field.name}:</span>{" "}
              {field["return"] ? (
                field["return"].types.map((type, index) => (
                  <span key={index}>{type}</span>
                ))
              ) : (
                <span className="em">any</span>
              )}
            </a>
          </div>
        ))}
      </div>
      <div className="pt-8">
        <h2 className="font-semibold">Fields</h2>
        {publicClass.fields.map(field => (
          <div key={field.longname}>{field.name}</div>
        ))}
      </div>
      <div className="pt-8">
        <h2 className="font-semibold">Methods</h2>
        {publicClass.methods.map(method => (
          <div key={method.longname}>{method.name}</div>
        ))}
      </div>
    </div>
  )
}
