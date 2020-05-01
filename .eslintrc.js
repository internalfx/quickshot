module.exports = {
  "env": {
    // "browser": true,
    // "es6": true,
    // "node": true
  },
  "extends": [
    "standard"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    // "ecmaVersion": 2018,
    // "sourceType": "module"
  },
  "plugins": [
    "import",
    "node",
    "promise",
    "standard"
  ],
  "rules": {
    "quotes": [1, "backtick"]
  },
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  }
};