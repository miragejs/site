const purgecss = require('@fullhuman/postcss-purgecss')({

  // Specify the paths to all of the template files in your project
  content: ['./src/**/*.js'],
  css: ['./src/styles/global.css'],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
})


module.exports = () => ({
  plugins: [
    require("tailwindcss"),
    // purgecss
  ],
});
