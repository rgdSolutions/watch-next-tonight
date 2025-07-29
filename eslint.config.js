const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const perfectionistPlugin = require('eslint-plugin-perfectionist');
const prettierPlugin = require('eslint-plugin-prettier');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  // Ignore patterns
  {
    ignores: ['**/*.yml', '**/*.yaml', '.next/**', 'node_modules/**', 'coverage/**', 'dist/**'],
  },

  // Base JavaScript config
  js.configs.recommended,

  // Next.js config using compatibility layer
  ...compat.extends('next/core-web-vitals', 'plugin:prettier/recommended'),

  // Global config for all files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
      perfectionist: perfectionistPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
        NodeJS: 'readonly',
        RequestInit: 'readonly',
        GeolocationPosition: 'readonly',
      },
    },
    rules: {
      // Turn off no-unused-vars for TypeScript files (handled by TypeScript)
      'no-unused-vars': 'off',

      // Prettier rules
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          trailingComma: 'es5',
          printWidth: 100,
          bracketSpacing: true,
          arrowParens: 'always',
        },
      ],

      // Perfectionist rules
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-named-imports': 'error',
      'perfectionist/sort-named-exports': 'error',
      'perfectionist/sort-exports': 'error',
    },
  },
];
