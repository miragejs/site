const plugin = require("tailwindcss/plugin")

function px(pixels) {
  return `${pixels / 16}rem`
}

module.exports = {
  theme: {
    fontFamily: {
      title: `"Ginto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      body: `"GT America", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      mono: `Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
    },
    colors: {
      transparent: "transparent",
      white: "white",
      black: "black",
      editor: "#282c34",
      gray: {
        50: "#fbfdfe",
        100: "#F7FAFC",
        200: "#E4ECF0",
        300: "#CAD4DB",
        400: "#B0BCC4",
        500: "#98A3AA",
        600: "#7A848B",
        700: "#52595D",
        800: "#41474A",
        900: "#2B2F31",
        1000: "#1A1C1D",
      },
      "gray-900.50": "rgba(43, 47, 49, 0.50)",
      blue: {
        100: "#EBF8FF",
        200: "#BEE3F8",
        300: "#90CDF4",
        400: "#63B3ED",
        500: "#4299E1",
        600: "#3182CE",
        700: "#2B6CB0",
        800: "#2C5282",
        900: "#2A4365",
      },
      green: {
        200: "#BEFFE7",
        400: "#2BCF91", // rgb(43, 207, 145)
        500: "#05C77E", // rgb(5, 199, 126)
        600: "#03a667",
        700: "#08a066",
        900: "#048b57",
      },
    },

    extend: {
      screens: {
        "2xl": "1440px",
      },
      boxShadow: {
        default:
          "0 1px 3px 0 rgba(16, 42, 67, 0.1), 0 1px 2px 0 rgba(16, 42, 67, 0.06)",
        black:
          "0 10px 25px 5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.8)",
      },
      lineHeight: {
        tighter: 1.125,
        "relaxed-sm": 1.6,
      },
      letterSpacing: {
        sm: "-0.0125em",
        title: "-0.0375em",
      },
      fontSize: {
        xs: px(12),
        "sm-": px(13),
        sm: px(14),
        "base-": px(15),
        base: px(16),
        "base+": px(17),
        lg: px(18),
        "lg+": px(19),
        xl: px(20),
        "1-5xl": px(21),
        "2xl": px(24),
        "2-25xl": px(26),
        "2-5xl": px(27),
        "3xl": px(30),
        "3-5xl": px(33),
        "4xl": px(36),
        "4-5xl": px(40),
        "4-75xl": px(44),
        "5xl": px(48),
        "5-5xl": px(56),
        "6xl": px(64),
      },
      minWidth: {
        "56": "16rem",
      },
      maxWidth: {
        "1-5xl": "40rem",
        "2-5xl": "45rem",
        "7xl": "80rem",
        "8xl": "88rem",
        measure: "35em",
      },
      width: {
        "28": "7rem",
        "34": "8.5rem",
        "36": "9rem",
      },
      height: {
        "128": "32rem",
      },
      borderWidth: {
        "3": "3px",
      },
      inset: {
        "-16": "-4rem",
        "-4": "-1rem",
        "8": "2rem",
        "16": "4rem",
      },
      spacing: {
        "7": "1.75rem",
        "14": "3.5rem",
        "15": "3.75rem",
        "72": "18rem",
        "96": "24rem",
      },
    },
  },

  variants: {
    borderColor: ["responsive", "hover", "focus", "focus-visible"],
    boxShadow: ["responsive", "hover", "focus", "focus-visible"],
    zIndex: ["responsive", "focus", "focus-visible"],
  },

  plugins: [
    require("@tailwindcss/custom-forms"),
    plugin(function ({ addVariant, e }) {
      addVariant("focus-visible", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(
            `focus-visible${separator}${className}`
          )}[data-focus-visible-added]`
        })
      })
    }),
  ],
}
