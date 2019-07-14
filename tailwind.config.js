module.exports = {
  theme: {
    // Overrides of theme default theme
    fontFamily: {
      title: `"Ginto"`,
      body: `"GT America", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      mono: `Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
    },
    colors: {
      transparent: "transparent",
      white: "#FFFFFF",
      gray: {
        50: "#fafafa",
        100: "#d3dade",
        500: "#7b878e",
        600: "#454d4f",
        // 800: "#2b3031",
        // 800: "#282d2e",
        // 800: "#262b2c",
        // 800: "#212526",
        700: "#272b2f",
        800: "#1f2123",
        900: "#1A1C1D",
        // 1000: "#111113",
        // 1000: "#131515",
        1000: "#111313",
      },
      black: "black",
      green: "#05C77E",
    },

    // Extensions of theme default theme
    extend: {
      boxShadow: {
        form:
          "0 0px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      lineHeight: {
        title: 1.21875,
        tighter: 1.125,
        "title-lg": 1.15,
        copy: 1.6,
      },
      letterSpacing: {
        sm: "-0.0125em",
        title: "-0.0375em",
      },
      fontSize: {
        "2-5xl": "1.6875rem",
        "3-5xl": "2.0625rem",
        "4-5xl": "2.5rem",
      },
      maxWidth: {
        "2-5xl": "45rem",
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
        "72": "18rem",
      },
    },
  },
  plugins: [require("@tailwindcss/custom-forms")],
}
