module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: [
    "react-app",
    "plugin:cypress/recommended",
    "plugin:chai-friendly/recommended",
  ],
}
