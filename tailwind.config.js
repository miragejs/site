module.exports = {
  theme: {
    // Overrides of theme default theme
    fontFamily: {
      title: `"Ginto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      body: `"GT America", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      mono: `Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
    },
    colors: {
      transparent: "transparent",
      white: "white",
      black: "black",
      gray: {
        xx100: "#F7FAFC",
        xx200: "#E4ECF0",
        xx300: "#CAD4DB",
        xx400: "#B0BCC4",
        xx500: "#98A3AA",
        xx600: "#7A848B",
        xx700: "#52595D",
        xx800: "#2B2F31",
        xx900: "#1A1C1D",

        600: "#454d4f",
        700: "#272b2f",
        800: "#1f2123",
        900: "#1A1C1D",
      },
      blue: {
        500: "#4299E1",
      },
      green: {
        500: "#05C77E",
        700: "#08a066",
        900: "#048b57",
      },
    },

    extend: {
      screens: {
        "2xl": "1440px",
      },
      boxShadow: {
        black:
          "0 10px 25px 5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.8)",
      },
      lineHeight: {
        title: 1.21875,
        tighter: 1.125,
        "title-lg": 1.15,
        copy: 1.6,
        // copy: 1.7,
      },
      letterSpacing: {
        sm: "-0.0125em",
        title: "-0.0375em",
      },
      fontSize: {
        "sm-": "0.8125rem",
        "base+": "1.0625rem",
        "lg+": "1.1875rem",
        "1-5xl": "1.3125rem",
        "2-25xl": "1.6rem",
        "2-5xl": "1.6875rem",
        "2-75xl": "1.875rem",
        "3-5xl": "2.0625rem",
        "4-5xl": "2.5rem",
        "4-75xl": "2.75rem",
        "5-5xl": "3.5rem",
      },
      maxWidth: {
        "1-5xl": "40rem",
        "7xl": "80rem",
        "8xl": "88rem",
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
  plugins: [require("@tailwindcss/custom-forms")],
}
