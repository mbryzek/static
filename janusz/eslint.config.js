import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default [
  { ignores: ['.svelte-kit/**', 'build/**', 'node_modules/**', 'content/**', 'fixtures/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...sveltePlugin.configs['flat/recommended'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  {
    files: ['**/*.svelte'],
    languageOptions: { parser: svelteParser, parserOptions: { parser: tseslint.parser } },
    rules: {
      // {@html} is the only XSS sink in a Svelte app. Every use must be an explicit exemption
      // naming why the string is safe; on this site it is always the build-time rendering of the
      // thesis text pulled from the projects repo, never anything a visitor supplies.
      'svelte/no-at-html-tags': 'error'
    }
  },
  prettierConfig
];
