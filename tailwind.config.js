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

        // Cool Gray from Refactoring UI
        // 100: "#F5F7FA",
        // 200: "#E4E7EB",
        // 300: "#CBD2D9",
        // 400: "#9AA5B1",
        // 500: "#7B8794",
        // 600: "#616E7C",
        // 700: "#52606D",
        // 800: "#3E4C59",
        // 900: "#323F4B",
        // 1000: "#1F2933",

        // Warm Gray from Refactoring UI
        // 100: "#FAF9F7",
        // 200: "#E8E6E1",
        // 300: "#D3CEC4",
        // 400: "#B8B2A7",
        // 500: "#A39E93",
        // 600: "#857F72",
        // 700: "#625D52",
        // 800: "#504A40",
        // 900: "#423D33",
        // 1000: "#27241D",

        // Gray from Refactoring UI
        // 100: "#F7F7F7",
        // 200: "#E1E1E1",
        // 300: "#CFCFCF",
        // 400: "#B1B1B1",
        // 500: "#9E9E9E",
        // 600: "#7E7E7E",
        // 700: "#626262",
        // 800: "#515151",
        // 900: "#3B3B3B",
        // 1000: "#222222",

        // Blue Gray from Refactoring UI
        // 100: "#F0F4F8",
        // 200: "#D9E2EC",
        // 300: "#BCCCDC",
        // 400: "#9FB3C8",
        // 500: "#829AB1",
        // 600: "#627D98",
        // 700: "#486581",
        // 800: "#334E68",
        // 900: "#243B53",
        // 1000: "#102A43",
      },
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
        default:
          "0 1px 3px 0 rgba(16, 42, 67, 0.1), 0 1px 2px 0 rgba(16, 42, 67, 0.06)",
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
      minWidth: {
        "56": "16rem",
      },
      maxWidth: {
        "1-5xl": "40rem",
        "2-5xl": "45rem",
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
