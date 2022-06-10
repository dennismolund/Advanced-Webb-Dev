module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es2020: true,
    },
    extends: [
      'airbnb-base',
    ],
    parserOptions: {
      ecmaVersion: 11,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      camelcase: ['off'],
      indent: 2,
      'linebreak-style': 0,
      'no-unused-vars': 0,
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-confusing-arrow': 0,
      'max-len': 0,
    },
  };
  