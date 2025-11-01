// Correct configuration
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  }
}

// Remove any old configuration like this:
// module.exports = {
//   plugins: [
//     require('tailwindcss'), // ← Remove this
//     require('autoprefixer'),
//   ]
// }