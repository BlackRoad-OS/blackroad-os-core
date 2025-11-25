# Contributing to BlackRoad OS Core

Thank you for your interest in contributing to BlackRoad OS Core! This document outlines our contribution guidelines and requirements.

## Table of Contents

- [Developer Certificate of Origin (DCO)](#developer-certificate-of-origin-dco)
- [Branch Guidelines](#branch-guidelines)
- [Pull Request Process](#pull-request-process)
- [Commit Guidelines](#commit-guidelines)
- [Code Style](#code-style)

## Developer Certificate of Origin (DCO)

We require all contributors to sign off their commits per the [Developer Certificate of Origin (DCO)](https://developercertificate.org/). This is a lightweight way for contributors to certify that they wrote or have the right to submit the code they are contributing.

### How to Sign Off

Add a `Signed-off-by` line to your commit messages:

```bash
# Option 1: Use the --signoff flag
git commit --signoff -m "Your commit message"

# Option 2: Manually add to commit message
git commit -m "Your commit message

Signed-off-by: Your Name <your.email@example.com>"
```

### Fixing Unsigned Commits

If you have unsigned commits, you can fix them:

```bash
# Fix the last commit
git commit --amend --signoff

# Fix multiple commits
git rebase --signoff HEAD~N
```

### DCO Text

By signing off, you certify the following:

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

## Branch Guidelines

We maintain a clean branch structure:

- **main**: Production-ready code. Protected branch requiring status checks and reviews.
- **staging**: Pre-production testing environment.
- **dev**: Active development branch.

### Branch Limits

- Maximum of **50 active branches** per repository
- Feature branches should be short-lived and deleted after merging
- Head branches are automatically deleted after PR merge
- Stale branches (inactive > 30 days) will be archived

> **Why 50 branches?** This limit helps maintain repository health by:
> - Keeping the branch list navigable and manageable
> - Encouraging timely completion and merging of features
> - Reducing cognitive overhead for contributors
> - Ensuring CI/CD resources aren't spread across too many branches
>
> When approaching this limit, maintainers will reach out to archive stale branches.

### Naming Conventions

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/modifications
- `chore/` - Maintenance tasks

## Pull Request Process

1. **Create a branch** from `dev` (or `main` for hotfixes)
2. **Make your changes** with signed-off commits
3. **Test locally** using `pnpm test` and `pnpm lint`
4. **Open a PR** against the appropriate base branch
5. **Wait for CI** - All status checks must pass
6. **Address review feedback** - At least one approval required
7. **Merge** - Squash and merge is preferred

### PR Requirements

- [ ] All commits are signed off (DCO)
- [ ] CI checks pass (lint, test, build)
- [ ] Code review approved
- [ ] Documentation updated (if applicable)
- [ ] No merge conflicts

## Commit Guidelines

Follow conventional commit format:

```
type(scope): description

[optional body]

Signed-off-by: Your Name <email@example.com>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions/modifications
- `chore`: Maintenance tasks

### Examples

```bash
git commit --signoff -m "feat(core): add TruthState aggregation"
git commit --signoff -m "fix(api): resolve null pointer in snapshot handler"
git commit --signoff -m "docs: update contributing guidelines"
```

## Code Style

- Use TypeScript for all new code
- Follow existing ESLint configuration
- Format with Prettier before committing
- Write tests for new functionality

### Quick Commands

```bash
# Install dependencies
pnpm install

# Run linter
pnpm lint

# Run tests
pnpm test

# Build
pnpm build

# Development mode
pnpm dev
```

## Questions?

If you have questions about contributing, please open an issue or reach out to the maintainers.

---

*Thank you for contributing to BlackRoad OS Core! 💚✨*
