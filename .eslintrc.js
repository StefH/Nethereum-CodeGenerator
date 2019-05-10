module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': [1, 999, 2],
    'class-methods-use-this': 0,
    'comma-dangle': 0
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
