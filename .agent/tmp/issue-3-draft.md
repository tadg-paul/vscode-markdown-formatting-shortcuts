# Issue #3: Publish v1.0.0 to VS Code Marketplace

## Problem

The extension is implemented (#1) and the publishing pipeline is in place (#2), but no public release has been made. Users cannot install the extension from the Marketplace.

## Solution

### Pre-flight checks

Before tagging:

1. All tests pass on `main` (CI green).
2. `npx vsce package` produces a clean `.vsix` with no warnings.
3. `README.md` is reviewed for accuracy as the Marketplace listing page.
4. `CHANGELOG.md` exists with a `v1.0.0` entry summarising the initial feature set.
5. `package.json` version is `1.0.0`.

### Tagging and publishing

```bash
git tag v1.0.0
git push origin v1.0.0
```

The `publish.yml` GitHub Actions workflow picks up the tag, runs the full build and test suite, and calls `npx vsce publish`. No manual `vsce publish` command is needed after the pipeline is in place.

### Post-publish verification

1. Open the Marketplace listing URL and confirm it is live.
2. Install the extension from the Marketplace into a VS Code instance (not the development host).
3. Open a Markdown document, select text, and verify each of the five commands works correctly via its default keybinding.
4. Open an Orgmode document and verify the Orgmode delimiter set is used.

### Homebrew / alternative distribution

Out of scope for this issue. If required, a separate issue should be opened.

## Acceptance criteria

| ID | AC | Tests |
|---|---|---|
| AC3.1 | The extension is findable and installable from the VS Code Marketplace by searching for "Markdown Formatting Shortcuts". | ⏳ UT-3.1: manual — search Marketplace, install, confirm version 1.0.0 |
| AC3.2 | All five formatting commands function correctly in a Markdown document installed from the Marketplace (not the dev host). | ⏳ UT-3.2: manual — exercise each command in a Marketplace-installed instance |
| AC3.3 | All five formatting commands use Orgmode delimiters in an `.org` document installed from the Marketplace. | ⏳ UT-3.3: manual — open `.org` file, exercise commands, verify delimiters |
| AC3.4 | The Marketplace listing displays the icon, description, and README content correctly. | ⏳ UT-3.4: manual — review listing page |
| AC3.5 | `CHANGELOG.md` contains a `v1.0.0` entry. | ⏳ RT-3.1: file exists and contains version entry |

**Key:** ✅ passing · ⏳ pending · ❌ failing · ~~🚫 removed~~

## Prerequisites

- Issues #1 and #2 closed (APPROVED)
- CI passing on `main`
- `VSCE_PAT` secret valid and not expired
