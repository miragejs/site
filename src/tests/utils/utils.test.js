/* eslint-disable no-template-curly-in-string */

import { escapeBackticks } from "../../utils"

describe("Utils", () => {
  describe("escapeBackticks", () => {
    it("escapes backticks for use when nesting template literals", () => {
      const str = "Hello, `${name}`"

      expect(`${escapeBackticks(str)}`).toBe("Hello, \\`${name}\\`")
    })
  })
})
