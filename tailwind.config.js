module.exports = {
  theme: {
    // Overrides of theme default theme
    fontFamily: {
      title: `"Ginto"`,
      body: `"GT America", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
    },
    colors: {
      transparent: "transparent",
      white: "#FFFFFF",
      gray: {
        dark: "#1A1C1D",
        light: "#98A3AA",
        lighter: "#d3dade",
      },
      green: "#05C77E",
    },

    // Extensions of theme default theme
    extend: {
      borderWidth: {
        "3": "3px",
      },
      lineHeight: {
        display: 1.15,
      },
    },
  },
}
