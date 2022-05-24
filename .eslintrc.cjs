module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    `standard`,
  ],
  parserOptions: {
    ecmaVersion: `latest`,
    sourceType: `module`,
  },
  rules: {
    'comma-dangle': [`error`, `always-multiline`],
    'object-shorthand': [`off`, `always`],
    quotes: [1, `backtick`],
    'vue/multi-word-component-names': [`off`, `always`],
  },
}
