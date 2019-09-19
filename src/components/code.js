import React from "react"
import Highlight, { defaultProps } from "prism-react-renderer"

export default function({ children, className, ...rest }) {
  const language = className ? className.replace(/language-/, "") : "text"
  const maybeRemoveLastLine = (token, i, tokens) => {
    let isLastToken = i === tokens.length - 1
    let isEmpty = token.length === 1 && token[0].empty

    return !(isLastToken && isEmpty)
  }

  return children ? (
    <Highlight
      {...defaultProps}
      code={children}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`subpixel-antialiased ${className}`}
          style={{ ...style }}
        >
          <code className="inline-block">
            {tokens.filter(maybeRemoveLastLine).map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  ) : null
}

let theme = undefined

// From StencilJs
// let theme = {
//   plain: {
//     // backgroundColor: "#212431", //#212431
//     color: "#e4e4e4",
//   },
//   styles: [
//     {
//       types: ["comment"],
//       style: {
//         color: "#7b878e",
//         fontStyle: "italic",
//       },
//     },
//     {
//       types: ["prolog", "doctype", "cdata"],
//       style: {
//         color: "#7b878e",
//       },
//     },
//     {
//       types: ["namespace"],
//       style: {
//         opacity: 0.7,
//       },
//     },
//     {
//       types: ["tag", "operator"],
//       style: {
//         color: "#bebec5",
//       },
//     },
//     {
//       types: ["boolean", "number"],
//       style: {
//         color: "#a77afe",
//       },
//     },
//     {
//       types: ["atrule", "deleted", "important", "keyword", "plain"],
//       style: {
//         color: "#c678dd",
//       },
//     },
//     {
//       types: ["class-name", "builtin"],
//       style: {
//         color: "#e6c07b",
//       },
//     },
//     {
//       types: ["function"],
//       style: {
//         color: "#61aeee",
//       },
//     },
//     {
//       types: ["string"],
//       style: {
//         color: "#98c379",
//       },
//     },
//     //   {
//     //     types: ["tag-id", "selector", "atrule-id"],
//     //     style: {
//     //       color: "#eeebff",
//     //     },
//     //   },
//     //   {
//     //     types: ["attr-name"],
//     //     style: {
//     //       color: "#c4b9fe",
//     //     },
//     //   },
//     //   {
//     //     types: [
//     //       "string",
//     //       "entity",
//     //       "url",
//     //       "attr-value",
//     //       "keyword",
//     //       "control",
//     //       "directive",
//     //       "unit",
//     //       "statement",
//     //       "regex",
//     //       "at-rule",
//     //       "placeholder",
//     //       "variable",
//     //     ],
//     //     style: {
//     //       color: "#ffcc99",
//     //     },
//     //   },
//     //   {
//     //     types: ["deleted"],
//     //     style: {
//     //       textDecorationLine: "line-through",
//     //     },
//     //   },
//     //   {
//     //     types: ["inserted"],
//     //     style: {
//     //       textDecorationLine: "underline",
//     //     },
//     //   },
//     //   {
//     //     types: ["italic"],
//     //     style: {
//     //       fontStyle: "italic",
//     //     },
//     //   },
//     //   {
//     //     types: ["important", "bold"],
//     //     style: {
//     //       fontWeight: "bold",
//     //     },
//     //   },
//     //   {
//     //     types: ["important"],
//     //     style: {
//     //       color: "#c4b9fe",
//     //     },
//     //   },
//   ],
// }

// var colors = {
//   char: "#D8DEE9",
//   comment: "#999999",
//   keyword: "#ffa7c4",
//   primitive: "#5a9bcf",
//   string: "#8dc891",
//   variable: "#d7deea",
//   boolean: "#ff8b50",
//   punctuation: "#5FB3B3",
//   tag: "#fc929e",
//   function: "#79b6f2",
//   className: "#FAC863",
//   method: "#6699CC",
//   operator: "#fc929e",
// }
//
// var theme /*: PrismTheme */ = {
//   plain: {
//     backgroundColor: "#282c34",
//     color: "#ffffff",
//   },
//   styles: [
//     {
//       types: ["attr-name"],
//       style: {
//         color: colors.keyword,
//       },
//     },
//     {
//       types: ["attr-value"],
//       style: {
//         color: colors.string,
//       },
//     },
//     {
//       types: ["comment", "block-comment", "prolog", "doctype", "cdata"],
//       style: {
//         color: colors.comment,
//       },
//     },
//     {
//       types: [
//         "property",
//         "number",
//         "function-name",
//         "constant",
//         "symbol",
//         "deleted",
//       ],
//       style: {
//         color: colors.primitive,
//       },
//     },
//     {
//       types: ["boolean"],
//       style: {
//         color: colors.boolean,
//       },
//     },
//     {
//       types: ["tag"],
//       style: {
//         color: colors.tag,
//       },
//     },
//     {
//       types: ["string"],
//       style: {
//         color: colors.string,
//       },
//     },
//     {
//       types: ["punctuation"],
//       style: {
//         color: colors.string,
//       },
//     },
//     {
//       types: ["selector", "char", "builtin", "inserted"],
//       style: {
//         color: colors.char,
//       },
//     },
//     {
//       types: ["function"],
//       style: {
//         color: colors.function,
//       },
//     },
//     {
//       types: ["operator", "entity", "url", "variable"],
//       style: {
//         color: colors.variable,
//       },
//     },
//     {
//       types: ["keyword"],
//       style: {
//         color: colors.keyword,
//       },
//     },
//     {
//       types: ["at-rule", "class-name"],
//       style: {
//         color: colors.className,
//       },
//     },
//     {
//       types: ["important"],
//       style: {
//         fontWeight: "400",
//       },
//     },
//     {
//       types: ["bold"],
//       style: {
//         fontWeight: "bold",
//       },
//     },
//     {
//       types: ["italic"],
//       style: {
//         fontStyle: "italic",
//       },
//     },
//     {
//       types: ["namespace"],
//       style: {
//         opacity: 0.7,
//       },
//     },
//   ],
// }

// var theme /*: PrismTheme */ = {
//   // github
//   plain: {
//     color: "#393A34",
//     // backgroundColor: "#f6f8fa",
//     backgroundColor: "#fafafa",
//   },
//   styles: [
//     {
//       types: ["comment", "prolog", "doctype", "cdata"],
//       style: {
//         color: "#999988",
//         fontStyle: "italic",
//       },
//     },
//     {
//       types: ["namespace"],
//       style: {
//         opacity: 0.7,
//       },
//     },
//     {
//       types: ["string", "attr-value"],
//       style: {
//         color: "#e3116c",
//       },
//     },
//     {
//       types: ["punctuation", "operator"],
//       style: {
//         color: "#393A34",
//       },
//     },
//     {
//       types: [
//         "entity",
//         "url",
//         "symbol",
//         "number",
//         "boolean",
//         "variable",
//         "constant",
//         "property",
//         "regex",
//         "inserted",
//       ],
//       style: {
//         color: "#36acaa",
//       },
//     },
//     {
//       types: ["atrule", "keyword", "attr-name", "selector"],
//       style: {
//         color: "#00a4db",
//       },
//     },
//     {
//       types: ["function", "deleted", "tag"],
//       style: {
//         color: "#d73a49",
//       },
//     },
//     {
//       types: ["function-variable"],
//       style: {
//         color: "#6f42c1",
//       },
//     },
//     {
//       types: ["tag", "selector", "keyword"],
//       style: {
//         color: "#00009f",
//       },
//     },
//   ],
// }
