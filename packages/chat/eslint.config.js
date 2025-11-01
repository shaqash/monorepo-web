import js from "@eslint/js";
import globals from "globals";
import tseslint, { parser } from "typescript-eslint";
import preact from "eslint-config-preact";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser } 
  },
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
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
]);
