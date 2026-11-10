import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import babelParser from '@babel/eslint-parser'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
    },
    rules: {
      'react/jsx-uses-vars': 'error',
      // Project convention: Context providers export the hook AND the provider
      // (plus helper constants) from a single file so consumers get one import
      // path. This is not a bug, so disable the hot-reload only-component rule.
      'react-refresh/only-export-components': 'off',
      // Empty catches are used intentionally as try-next-fallback strategies
      // (e.g. resolving a product variant id). Allow them.
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Destructuring-with-rest is used to strip a field (e.g. paid_amount)
      // before submitting a form. Allow the "sibling" bindings to go unused.
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 'latest',
        sourceType: 'module',
        babelOptions: { plugins: ['@babel/plugin-syntax-jsx'] },
      },
      globals: globals.browser,
    },
  },
  // Node-style config/build files (vite.config.js, etc.) use `process`, `__dirname`.
  {
    files: ['*.config.js', '*.config.mjs', 'vite.config.js', 'vitest.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
])