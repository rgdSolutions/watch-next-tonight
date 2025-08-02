# Linting and Formatting

- Install ESLint, eslint-plugin-perfectionist, Prettier, husky and lint-staged
- Configure husky and lint-staged to run ESLint and Prettier on commit

prettier and eslint configurations can have these options:

```
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always"
}
```

# Pre-Commit Hooks

- Install and configure husky and lint-staged so that we run the following commands on commit:

"tsc --noEmit"
"prettier --write ."
"next lint"

# Testing

- Install and configure vitest and @testing-library/react with test coverage and the following npm script commands:

"checks": "npm run type-check && npm run format && npm run lint:fix && npm run test:coverage",
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint",
"lint:fix": "next lint --fix",
"format": "prettier --write .",
"prepare": "husky",
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest run --coverage",
"type-check": "tsc --noEmit"

# GitHub Action Workflows

- add .github/dependabot.yml to enable version updates for npm and also GitHub Actions:

```
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    # Ignore specific dependencies
    ignore:
      - dependency-name: "postcss"
      - dependency-name: "@radix-ui/*"
      - dependency-name: "tailwindcss"
      - dependency-name: "autoprefixer"

    # Optional: Configure how many PRs to open at once
    open-pull-requests-limit: 2

    # Optional: Add labels to PRs
    labels:
      - "dependencies"
      - "automated"
```

- add .github/workflows/pr-checks.yml to run the following steps on PR creation:

```
name: PR Checks

on:
  pull_request:
    branches: [main, develop]
    types: [opened, synchronize, reopened]

jobs:
  quality-checks:
    name: Code Quality Checks
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript check
        run: npx tsc --noEmit

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier check
        run: npx prettier --check .

      - name: Run tests
        run: npm run test -- --run

      - name: Build project
        run: npm run build

  test-coverage:
    name: Test Coverage
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage reports
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7

  dependency-check:
    name: Dependency Security Check
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: Check for outdated packages
        run: npm outdated
        continue-on-error: true
```
