import js from '@eslint/js';
import globals from 'globals';
import tseslint, { parser } from 'typescript-eslint';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import preact from 'eslint-config-preact';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  preact,
  {
    languageOptions: {
      parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js'],
        },
      },
    },
  },
  tanstackQuery.configs['flat/recommended'],
  prettier,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
        },
      ],
    },
  },
  tseslint.configs.recommended,
]);
