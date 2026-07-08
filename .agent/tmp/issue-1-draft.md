# Issue #1: Implement core extension

## Problem

The extension does not yet exist. The repository contains only a README describing the intended behaviour. A working VS Code extension must be built from scratch: TypeScript project scaffold, formatting toggle logic, language detection, configuration system, keybindings, and a passing test suite.

## Solution

### Scaffold

Initialise the extension using the standard VS Code extension structure (no Yeoman required — create files directly):

- `package.json` — manifest with `contributes.commands`, `contributes.keybindings`, `contributes.configuration`, `activationEvents` for `onLanguage:markdown` and `onLanguage:org`
- `tsconfig.json` — targets `ES2020`, module `commonjs`, `outDir: out/`
- `.vscodeignore` — excludes `src/`, `test/`, `node_modules/`
- `src/extension.ts` — `activate` / `deactivate` entry point
- `src/formatter.ts` — core toggle logic (pure functions, no VS Code dependency)
- `src/config.ts` — reads `vscode.workspace.getConfiguration` and returns typed config objects

Dependencies: `@types/vscode`, `typescript`, `@vscode/test-electron`, `mocha`, `@types/mocha`

### Toggle logic (`formatter.ts`)

Each formatting command follows a single algorithm:

1. If selection is empty and `applyToSelectionOnly` is `true`, return early.
2. Resolve the marker pair for the format and language (from config).
3. For code specifically: if selection spans > 1 line, use block markers; otherwise inline.
4. If selected text starts with prefix and ends with suffix → strip them (toggle off).
5. Otherwise → wrap with prefix and suffix (toggle on).
6. Return the modified text; the command handler applies the edit and repositions the cursor inside the markers.

`formatter.ts` exports pure functions operating on strings; no VS Code API calls. This keeps it unit-testable without a VS Code host.

### Commands registered in `extension.ts`

| Command ID | Default binding |
|---|---|
| `markdownShortcuts.toggleBold` | `ctrl+s ctrl+b` |
| `markdownShortcuts.toggleItalic` | `ctrl+s ctrl+i` |
| `markdownShortcuts.toggleCode` | `` ctrl+s ctrl+` `` |
| `markdownShortcuts.toggleStrikethrough` | `ctrl+s ctrl+-` |
| `markdownShortcuts.clearFormatting` | `ctrl+s ctrl+space` |

### Configuration schema (`package.json`)

One configuration section `markdownShortcuts` with per-language sub-objects (`markdown`, `org`) and a global `applyToSelectionOnly` boolean.

### Tests (`test/suite/`)

- **Unit tests** (no VS Code host): exercise all branches of `formatter.ts` — toggle on, toggle off, empty selection guard, inline vs. block detection.
- **Integration tests** (VS Code extension host): open a scratch document, execute each command via `vscode.commands.executeCommand`, assert the resulting text.

`make test` entry point: `npm run test` (compiles TypeScript then runs `@vscode/test-electron`).

## Acceptance criteria

| ID | AC | Tests |
|---|---|---|
| AC1.1 | Given a Markdown document with text selected, bold toggle wraps the selection with `**` on first invocation and strips them on second. | ⏳ RT-1.1: unit — toggle on; RT-1.2: unit — toggle off; UT-1.1: integration — bold command |
| AC1.2 | Given a Markdown document with text selected, italic toggle wraps/unwraps with `*`. | ⏳ RT-1.3: unit — italic toggle on; RT-1.4: unit — italic toggle off |
| AC1.3 | Given a single-line selection in a Markdown document, code toggle wraps/unwraps with `` ` ``. | ⏳ RT-1.5: unit — inline code |
| AC1.4 | Given a multi-line selection in a Markdown document, code toggle wraps/unwraps with ```` ``` ```` block markers. | ⏳ RT-1.6: unit — block code detection; RT-1.7: unit — block code toggle |
| AC1.5 | Given a Markdown document with text selected, strikethrough toggle wraps/unwraps with `~~`. | ⏳ RT-1.8: unit — strikethrough |
| AC1.6 | Given an Orgmode document, each format command uses Orgmode-specific delimiters (`*`, `/`, `=`, `#+BEGIN_SRC`/`#+END_SRC`, `+`). | ⏳ RT-1.9: unit — org bold; RT-1.10: unit — org italic; RT-1.11: unit — org inline code; RT-1.12: unit — org block code; RT-1.13: unit — org strikethrough |
| AC1.7 | Given no text is selected and `applyToSelectionOnly` is `true`, all commands leave the document unchanged. | ⏳ RT-1.14: unit — empty selection guard |
| AC1.8 | Given custom markers configured in workspace settings, the extension uses those markers instead of the defaults. | ⏳ RT-1.15: unit — custom marker resolution |
| AC1.9 | Clear-formatting strips all known formatting markers from the selected text. | ⏳ RT-1.16: unit — clear bold; RT-1.17: unit — clear italic; RT-1.18: unit — clear code |
| AC1.10 | `make test` (i.e. `npm run test`) exits 0 with all tests passing. | ⏳ RT-1.19: build gate |

**Key:** ✅ passing · ⏳ pending · ❌ failing · ~~🚫 removed~~
