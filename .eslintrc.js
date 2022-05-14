module.exports = {
  env: {
    // "browser": true,
    // "es6": true,
    // "node": true
  },
  extends: [
    `standard`,
  ],
  globals: {
    Atomics: `readonly`,
    SharedArrayBuffer: `readonly`,
  },
  plugins: [
    `html`,
    `import`,
    `node`,
    `promise`,
  ],
  rules: {
    quotes: [1, `backtick`],
    "comma-dangle": [`error`, `always-multiline`],
  },
  parserOptions: {
    parser: `babel-eslint`,
    sourceType: `module`,
  },
}
