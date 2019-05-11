module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'class-methods-use-this': 0,
    // 'comma-dangle': 0,
    'import/no-unresolved': 'off', // Suppress errors caused by import '@/...'
    'max-len': 'off', // Allow lines longer than 100 characters
    quotes: ['error', 'single', 'avoid-escape'],
    'no-param-reassign': [
      'error', // Allow param reassigns required by Vuex
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state',
          'acc',
          'e',
          'ctx',
          'req',
          'request',
          'res',
          'response',
          '$scope',
        ],
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
