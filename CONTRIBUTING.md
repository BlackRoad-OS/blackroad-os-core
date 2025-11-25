# Contributing to BlackRoad OS Core 🖤💚

Thank you for your interest in contributing to BlackRoad OS Core! This is the cognitive kernel of BlackRoad OS — the Truth Engine that powers fact verification.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Commit Message Standard](#commit-message-standard)
- [Pull Request Process](#pull-request-process)
- [DCO Sign-off](#dco-sign-off)

## Code of Conduct

Be respectful, inclusive, and professional. We're building something meaningful together.

## How to Contribute

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your feature/fix
4. **Make changes** following our standards
5. **Test** your changes thoroughly
6. **Submit** a pull request

## Development Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run linting
pnpm lint

# Run tests
pnpm test

# Build
pnpm build
```

## Commit Message Standard 🧠

We use semantic commit messages. Every commit must start with one of these prefixes:

| Prefix     | Description                                    |
|------------|------------------------------------------------|
| `feat:`    | New feature                                    |
| `fix:`     | Bug fix                                        |
| `chore:`   | Maintenance tasks                              |
| `docs:`    | Documentation changes                          |
| `refactor:`| Code refactoring without feature changes       |
| `test:`    | Adding or updating tests                       |

### Examples

```
feat: add TruthState aggregation endpoint
fix: correct confidence calculation in truth aggregation
docs: update API documentation for /health endpoint
chore: update dependencies
refactor: simplify verification job lifecycle
test: add unit tests for PS-SHA∞ hashing
```

## Pull Request Process

1. Ensure your code passes all tests (`pnpm test`)
2. Ensure your code passes linting (`pnpm lint`)
3. Update documentation if needed
4. Request review from `@blackroad-core`
5. Wait for CI checks to pass
6. Get at least one approval before merging

## DCO Sign-off 🖊️

All commits must be signed off to indicate you agree to the Developer Certificate of Origin (DCO).

Add `-s` to your commit command:

```bash
git commit -s -m "feat: your commit message"
```

This adds a `Signed-off-by` line to your commit message.

---

## Questions?

Open an issue or reach out to the maintainers. We're here to help! 💚
