module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'prettier', '@typescript-eslint', 'testing-library', 'jest-dom', 'cypress'],
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
    'plugin:jest-dom/recommended',
    'plugin:testing-library/react',
    'plugin:cypress/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 0,
    'react/display-name': 0,
    'react/no-children-prop': 0,
    'react/require-default-props': 0,
    'react/no-unescaped-entities': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        argsIgnorePattern: '^_',
      },
    ],
    'no-console': [
      1,
      {
        allow: ['warn', 'error'],
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'no-use-before-define': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.spec.ts', '**/*.spec.tsx'] },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['./src'],
      },
    },
  },
}
