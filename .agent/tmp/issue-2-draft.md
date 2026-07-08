# Issue #2: Marketplace preparation

## Problem

The working extension (from #1) cannot be published to the VS Code Marketplace. The manifest lacks required marketplace fields (publisher ID, icon, categories, description), no CI pipeline exists, and the `vsce` packaging tooling is not configured.

## Solution

### Publisher registration

A publisher account is required at https://marketplace.visualstudio.com/manage. The publisher ID must be chosen and registered before `vsce publish` can run. The ID is set as the `publisher` field in `package.json`.

This is a one-time manual step; it cannot be automated. It is a prerequisite for this issue to be closed.

### `package.json` marketplace fields

Add to the existing `package.json`:

```json
{
  "publisher": "<publisher-id>",
  "displayName": "Markdown Formatting Shortcuts",
  "description": "Keyboard shortcuts to toggle bold, italic, code and strikethrough in Markdown and Orgmode.",
  "version": "0.0.1",
  "icon": "assets/icon.png",
  "categories": ["Keymaps", "Other"],
  "keywords": ["markdown", "orgmode", "formatting", "shortcuts", "bold", "italic"],
  "repository": { "type": "git", "url": "https://github.com/<org>/<repo>" },
  "license": "MIT"
}
```

### Icon

A 128×128 PNG icon at `assets/icon.png`. Simple design: a bold **B** or a format-toggle symbol on a neutral background. Created once; does not need to change between releases.

### Marketplace README

The existing `README.md` is the Marketplace listing page. No separate file is needed — `vsce` uses `README.md` by default. The tidied README from the repository preparation work already covers the required content.

### `vsce` packaging

Add `@vscode/vsce` as a dev dependency. Add `make` targets:

```makefile
package:
    npx vsce package

publish:
    npx vsce publish
```

`vsce package` produces a `.vsix` file and is used by CI to verify the package builds correctly. `vsce publish` is reserved for tagged releases.

### GitHub Actions CI

Two workflows:

**`ci.yml`** — runs on every push and pull request to `main`:
1. `npm ci`
2. `npm run compile`
3. `npm test` (requires a headless display; use `xvfb-run` on Linux runners)
4. `npx vsce package` (verifies the package is buildable)

**`publish.yml`** — runs on `push` of tags matching `v*.*.*`:
1. Same build + test steps as `ci.yml`
2. `npx vsce publish` using a `VSCE_PAT` secret (Personal Access Token from the publisher account)

### `.gitignore` additions

Add `*.vsix` and `out/` to `.gitignore` if not already present.

## Acceptance criteria

| ID | AC | Tests |
|---|---|---|
| AC2.1 | The `package.json` contains all fields required by `vsce` (`publisher`, `displayName`, `description`, `version`, `icon`, `categories`, `repository`, `license`). | ⏳ RT-2.1: `npx vsce ls` exits 0 with no validation errors |
| AC2.2 | `npx vsce package` produces a `.vsix` file without errors. | ⏳ RT-2.2: packaging gate — vsix produced |
| AC2.3 | An icon file exists at `assets/icon.png` at 128×128 pixels. | ⏳ RT-2.3: file exists and dimensions correct |
| AC2.4 | The CI workflow runs on push to `main`, compiles, tests, and packages the extension without errors. | ⏳ UT-2.1: manual — push to main branch, verify Actions run passes |
| AC2.5 | The publish workflow triggers on a semver tag and publishes using the `VSCE_PAT` secret. | ⏳ UT-2.2: manual — push `v0.0.1` tag, verify publish step runs (dry-run acceptable for first verification) |

**Key:** ✅ passing · ⏳ pending · ❌ failing · ~~🚫 removed~~

## Prerequisites

- Publisher account registered at marketplace.visualstudio.com
- `VSCE_PAT` secret added to the GitHub repository settings
- GitHub remote configured for the repository
