import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    // These fragments share the build wrapper's scope; lint their assembled client.js.
    ignores: ['node_modules/**', '.local-backups/**', 'local/**', 'artifacts/**', 'coverage/**',
      'src/**', 'modules/*/lib/client.js', 'modules/mood/client.js', 'modules/mood/assets/widget.js'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs}'],
    languageOptions: { globals: globals.node },
    rules: {
      ...js.configs.recommended.rules,
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none', ignoreRestSiblings: true, varsIgnorePattern: '^_' }],
      // Existing defensive initializers are retained to avoid broad runtime rewrites.
      'no-useless-assignment': 'off',
      // Sanitizers deliberately match control characters in untrusted input.
      'no-control-regex': 'off',
      // Public errors must not retain causes containing credentials or chat text.
      'preserve-caught-error': 'off',
    },
  },
  {
    files: ['client.js'],
    languageOptions: { globals: { ...globals.browser, require: 'readonly', Buffer: 'readonly' } },
    // Keep legacy React hook slots and module-private compatibility helpers intact.
    rules: { 'no-unused-vars': 'off' },
  },
  {
    files: ['modules/qq/tools/voice/read-aloud-sentinel/*.js'],
    languageOptions: { globals: { ...globals.browser, chrome: 'readonly' } },
  },
  {
    files: ['tests/**/*.mjs', 'modules/*/tests/**/*.mjs'],
    // Empty async generators model an upstream stream that returns no events.
    rules: { 'require-yield': 'off' },
  },
]
