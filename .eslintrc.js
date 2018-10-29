module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  env: {
    mocha: true,
    node: true,
    browser: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react', 'prettier'],
  globals: {
    should: true,
    sinon: true
  },
  rules: {
    'no-mixed-spaces-and-tabs': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'prettier/prettier': 'error'
  }
};
