module.exports = {
  // This is the root ESLint configuration.
  root: true,
  // Use the '@typescript-eslint/parser' for parsing TypeScript code.
  parser: '@typescript-eslint/parser',
  // Configure parser options, particularly where to find 'tsconfig.json'.
  parserOptions: {
    project: ['tsconfig.json'],
  },
  // Ignore specific patterns (e.g., '*.js') during linting.
  ignorePatterns: [
    '*.js',
    '*.html',
    '*.css',
    // TEMPS
    '*.service.ts',
  ],
  // ESLint plugins.
  plugins: [],
  // Extend ESLint configurations to include recommended rules.
  extends: [
    // Basic ESLint recommended rules.
    'eslint:recommended',
    // TypeScript recommended rules.
    'plugin:@typescript-eslint/recommended',
    // TypeScript recommended rules.
    'plugin:@typescript-eslint/stylistic',
    // Prettier formatting rules.
    'prettier',
    // Angular specifics
    'plugin:@angular-eslint/recommended',
  ],
  rules: {
    // Enforce consistent brace style for all control statements (ex : return statements).
    curly: 'error',
    // Require the use of === and !== operators.

    eqeqeq: ['error', 'always'],
    // Disallow specified warning terms in comments.
    'no-warning-comments': ['error', { terms: ['import'] }],

    // Warn on the use of console.log() allow console.error/warn().
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // Disallow duplicate module imports.
    'no-duplicate-imports': 'error',

    // Disallow comparisons where both sides are exactly the same.
    'no-self-compare': 'error',

    // Disallow if statements as the only statement in else blocks.
    'no-lonely-if': 'error',

    // Disallow ternary operators when simpler alternatives exist.
    'no-unneeded-ternary': 'error',

    // Require template literals instead of string concatenation.
    'prefer-template': 'error',

    // Enforce consistent spacing after the // or /* in a comment.
    'spaced-comment': 'error',

    // Enforce TypeScript report unused variables in the code.
    '@typescript-eslint/no-unused-vars': 'error',

    // Disable the requirement for explicitly specifying module boundary types in TypeScript functions.
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Disallow the any type.
    '@typescript-eslint/no-explicit-any': 'error',

    // Disallow empty exports that don't change anything in a module file.
    '@typescript-eslint/no-useless-empty-export': 'error',

    // Require each enum member value to be explicitly initialized.
    '@typescript-eslint/prefer-enum-initializers': 'error',

    // Enforce using concise optional chain expressions instead of chained logical ands, negated logical ors, or empty objects.
    '@typescript-eslint/prefer-optional-chain': 'error',
  },
  // Override rules.
  overrides: [
    // EsLint specific configuration (TS files)
    {
      files: ['*.ts'],
      extends: ['plugin:@angular-eslint/template/process-inline-templates'],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
      },
    },
  ],
}
