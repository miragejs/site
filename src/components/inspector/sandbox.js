import React from "react"

export default function ({ srcDoc, iframeRef }) {
  if (typeof window === "undefined") return null

  return (
    <iframe
      ref={iframeRef}
      title="Output"
      className="hidden"
      sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
      srcDoc={srcDoc}
    ></iframe>
  )
}
