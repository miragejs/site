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
        // light: "#98A3AA",
        light: "#737f87",
        lighter: "#d3dade",
      },
      green: "#05C77E",
    },
    fontSize: {
      lg: "1.125rem",
      "2lg": "1.1875rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3.5xl": "2rem",
      "4xl": "2.25rem",

      // title: "2.375rem",
      title: "2.25rem",
      // title: "2.325rem",
      // title: "2.5rem",

      "4.5xl": "2.625rem",
      "5xl": "3rem",
    },
    lineHeight: {
      tight: 1.25,

      // title: 1.15,
      // title: 1.1875,
      // title: 1.21875,
      title: 1.225,
      // title: 1.25,

      normal: 1.5,
      // display: 1.125,
      // copy: 1.4375,
      copy: 1.5,
    },

    // Extensions of theme default theme
    extend: {
      borderWidth: {
        "3": "3px",
      },
      letterSpacing: {
        title: "-0.0375em",
        // title: "-0.05em",
        // title: "-0.025em",
      },
    },
  },
}
