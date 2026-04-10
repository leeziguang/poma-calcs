module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    __ENV__: 'readonly',
    __LOCALE__: 'readonly',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  // plugins: ['react-hooks'], // react-hooks plugin makes lots of trouble.
  rules: {
    // recommended from eslint-plugin-react-hooks
    // 'react-hooks/rules-of-hooks': 'error',
    // 'react-hooks/exhaustive-deps': 'warn',

    camelcase: 'off',
    '@typescript-eslint/camelcase': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',

    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',

    // disable the rule for all files
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/class-name-casing': 'off',

    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
