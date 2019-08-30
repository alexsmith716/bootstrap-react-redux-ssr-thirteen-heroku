
// postcss-loader exposes Context (ctx) to the config file, making postcss.config.js dynamic

module.exports = ({ file }) => ({
  plugins: {
    'postcss-import': { root: file.dirname },
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {},
    'autoprefixer': {},
    'postcss-browser-reporter': {},
    'postcss-reporter': {}
  }
})

// module.exports = {
//   "parser": "postcss-comment",
//   "plugins": {
//     "autoprefixer": {},
//     "postcss-import": {},
//     "postcss-mixins": {},
//     "postcss-simple-vars": {},
//     "postcss-nested": {},
//     "postcss-calc": {}
//   }
// }