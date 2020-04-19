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

    customForms: (theme) => ({
      default: {
        select: {
          icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'><path d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='#9fa6b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`,
          "&:focus": {
            boxShadow: `0 0 0 3px rgba(164,202,254,.45)`,
            borderColor: theme("colors.blue.300"),
          },
        },
        textarea: {
          "&:focus": {
            boxShadow: `0 0 0 3px rgba(164,202,254,.45)`,
            borderColor: theme("colors.blue.300"),
          },
        },
        input: {
          "&:focus": {
            boxShadow: `0 0 0 3px rgba(164,202,254,.45)`,
            borderColor: theme("colors.blue.300"),
          },
        },
        checkbox: {
          "&:focus": {
            boxShadow: `0 0 0 3px rgba(164,202,254,.45)`,
            borderColor: theme("colors.blue.300"),
          },
        },
        radio: {
          "&:focus": {
            boxShadow: `0 0 0 3px rgba(164,202,254,.45)`,
            borderColor: theme("colors.blue.300"),
          },
        },
      },
    }),

    extend: {
      colors: {
        transparent: "transparent",
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
        green: {
          200: "#BEFFE7",
          400: "#2BCF91",
          500: "#05C77E",
          600: "#03a667",
          700: "#08a066",
          900: "#048b57",
        },
      },
      screens: {
        "2xl": "1440px",
      },
      boxShadow: {
        default:
          "0 1px 3px 0 rgba(16, 42, 67, 0.1), 0 1px 2px 0 rgba(16, 42, 67, 0.06)",
        black:
          "0 10px 25px 5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.8)",
        outline: "0 0 0 3px rgba(164,202,254,.45)",
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
        "28": px(112),
        "128": "32rem",
        "1/2": "50%",
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
        "7": px(28),
        "14": px(56),
        "15": px(60),
        "26": px(104),
        "72": px(288),
        "96": px(384),
      },
    },
  },

  variants: {
    borderColor: ["responsive", "hover", "focus", "focus-visible"],
    boxShadow: ["responsive", "hover", "focus", "focus-visible"],
    zIndex: ["responsive", "focus", "focus-within", "focus-visible"],
  },

  plugins: [
    require("@tailwindcss/custom-forms"),

    /*
      This plugin required updates to the purgecss extractor – see gatsby-config.js
      for the related change.
    */
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
