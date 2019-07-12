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
        100: "#d3dade",
        500: "#7b878e",
        700: "#454d4f",
        // 800: "#2b3031",
        800: "#282d2e",
        // 800: "#262b2c",
        900: "#1A1C1D",
        1000: "#111113",
      },
      black: "black",
      green: "#05C77E",
    },

    // Extensions of theme default theme
    extend: {
      fontSize: {
        "2.5xl": "1.6875rem",
        "4.5xl": "2.5rem",
        "4.75xl": "2.65rem",
      },
      lineHeight: {
        title: 1.21875,
        "title-lg": 1.15,
        copy: 1.6,
      },
      height: {
        "128": "32rem",
      },
      borderWidth: {
        "3": "3px",
      },
      letterSpacing: {
        sm: "-0.0125em",
        title: "-0.0375em",
      },
    },
  },
}
