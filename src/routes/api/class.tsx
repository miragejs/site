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

export default function(props) {
  let classSlug = props.classSlug
  let { publicClasses } = useApiDocs()
  let classDoc = publicClasses.find(doc => doc.slug === classSlug)

  return (
    <div>
      <H1>{classDoc.name}</H1>
      <P>API docs coming soon!</P>

      {/*
      <div className="pt-2">{classDoc.description}</div>
      <div className="pt-4">
        <h2 className="font-semibold">Fields</h2>
        {classDoc.fields.map(field => (
          <div key={field.longname}>{field.name}</div>
        ))}
      </div>
      <div className="pt-4">
        <h2 className="font-semibold">Methods</h2>
        {classDoc.methods.map(method => (
          <div key={method.longname}>{method.name}</div>
        ))}
      </div>
      */}
    </div>
  )
}
