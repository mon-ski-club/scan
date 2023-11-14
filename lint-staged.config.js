module.exports = {
  // Configure lint-staged to target TypeScript and TypeScript files for type checking.
  '**/*.(ts)': () => 'npm run tscheck',

  // Configure lint-staged to target JavaScript, and TypeScript files for linting and formatting.
  '**/*.(js|ts)': (filenames) => [
    // Run ESLint with the --fix flag to automatically fix linting issues in staged files.
    `npx eslint --fix ${filenames.join(' ')}`,

    // Run Prettier to format staged files and save the changes.
    `npx prettier --write ${filenames.join(' ')}`,
  ],
}
