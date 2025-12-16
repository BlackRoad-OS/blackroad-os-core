# Releases 🚀

This document tracks releases for BlackRoad OS Core — the Truth Engine.

## Release Policy 🔒

- **Tags are immutable**: Once a release tag (e.g., `v1.0.0`) is created, it is never changed.
- **Semantic Versioning**: We follow [SemVer](https://semver.org/) for versioning.
- **Protected Branches**: The `main` branch is protected and requires PR reviews.

## Versioning Format

```
vMAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

---

## Release History

### v0.0.1 (Initial)

- Initial scaffold release
- Core Truth Engine types and interfaces
- PS-SHA∞ hashing implementation
- Basic verification job lifecycle
- Lucidia validation framework

---

## Upcoming Releases

See the [project board](https://github.com/orgs/BlackRoad-OS/projects) for planned work.

---

## Creating a Release

Releases are created by the `release-tag.yml` workflow when:
1. A tag matching `v*.*.*` is pushed
2. All CI checks pass
3. The release is created on GitHub with auto-generated notes

```bash
# Create a release tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

---

## Security

For security vulnerabilities, please see our security policy or contact the maintainers directly.
