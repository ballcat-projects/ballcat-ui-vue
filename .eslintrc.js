module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint",
    sourceType: 'module',
    ecmaVersion: 2015
  },
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    // 'plugin:vue/vue3-recommended',
    'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  // required to lint *.vue files
  plugins: [
    'html'
  ],

}
