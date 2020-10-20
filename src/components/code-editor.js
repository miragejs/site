import React, { useEffect } from "react"
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

export default function CodeEditor({
  value = "",
  onChange = () => {},
  extraKeys,
  "data-testid": dataTestId,
}) {
  let editorDivRef = React.useRef()
  let editorRef = React.useRef()
  let handlerRef = React.useRef()

  // CodeEditor can't handle nulls or undefineds
  value = value ?? ""

  handlerRef.current = onChange

  useEffect(() => {
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
          handlerRef.current(cm.getValue())
        })
      }

      if (dataTestId) {
        editorRef.current
          .getWrapperElement()
          .setAttribute("data-testid", dataTestId)
      }

      editorRef.current.setOption("extraKeys", extraKeys)
    }

    f()
  }, [value, dataTestId, extraKeys])

  /*
    If the parent passes in a new value after the editor has been
    initialized, we may need to update it. That's what this effect is for.
  */
  useEffect(() => {
    let editorValue = editorRef.current?.getValue()
    if (value && editorValue && value !== editorValue) {
      editorRef.current.setValue(value)
    }
  }, [value])

  return (
    <>
      <GlobalStyle />
      <div className="h-full" ref={editorDivRef}></div>
    </>
  )
}
