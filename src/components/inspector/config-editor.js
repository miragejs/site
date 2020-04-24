import React from "react"
import "codemirror/lib/codemirror.css"
import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  .CodeMirror {
    height: 100%;
  }
  .CodeMirror-lines {
    font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.6;
    -webkit-font-smoothing: auto;
    -moz-osx-font-smoothing: auto;
  }
`

export default function ({ value, onChange }) {
  let editorDivRef = React.useRef()
  let editorRef = React.useRef()

  React.useEffect(() => {
    // Load CodeMirror + its plugins using dynamic import, since they
    // only work in the browser.
    const f = async () => {
      if (!editorRef.current) {
        let CodeMirror = (await import("codemirror")).default
        await import("codemirror/mode/javascript/javascript")

        editorRef.current = new CodeMirror(editorDivRef.current, {
          value,
          mode: "javascript",
        })

        editorRef.current.on("change", (cm) => {
          onChange(cm.getValue())
        })
      }
    }

    f()
  }, [onChange, value])

  return (
    <>
      <GlobalStyle />
      <div ref={editorDivRef}></div>
    </>
  )
}
