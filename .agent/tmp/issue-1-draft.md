# Issue #1: Implement core extension

## Problem

The extension does not yet exist. The repository contains only a README describing the intended behaviour. A working VS Code extension must be built: TypeScript project scaffold, formatting toggle logic, configuration system, keybindings, and a passing test suite.

## Solution

### Scaffold

Standard VS Code extension structure:

- `package.json` -- manifest with `contributes.commands`, `contributes.keybindings`, `contributes.configuration`, `activationEvents` for `onLanguage:markdown` and `onLanguage:org`
- `tsconfig.json` -- targets `ES2020`, module `commonjs`, `outDir: out/`
- `.vscodeignore` -- excludes `src/`, `test/`, `node_modules/`
- `src/extension.ts` -- `activate` / `deactivate` entry point
- `src/formatter.ts` -- pure-function toggle logic (no VS Code API dependency, fully unit-testable)
- `src/config.ts` -- reads language-scoped config via `vscode.workspace.getConfiguration('markdownShortcuts', document)`

Dev dependencies: `@types/vscode`, `typescript`, `@vscode/test-electron`, `mocha`, `@types/mocha`.

### Toggle logic (`formatter.ts`)

All toggle commands (`toggleBold`, `toggleItalic`, `toggleCode`, `toggleStrikethrough`) share a common algorithm:

1. Resolve prefix and suffix from language-scoped configuration.
2. **If selection is empty and `applyToSelectionOnly` is `false` (default):** insert prefix and suffix at the cursor position; move the cursor between them ("smart insert"). Ready for the user to type.
3. **If selection is empty and `applyToSelectionOnly` is `true`:** no-op.
4. **If selection is non-empty and already wrapped in the markers:** strip the markers (toggle off).
5. **If selection is non-empty and not wrapped:** wrap it with the markers (toggle on).

`toggleCode` additionally auto-selects inline vs block markers based on the selection span:
- Empty or single-line -> inline markers.
- Multi-line -> block markers, placed on their own lines above and below the selection.

`clearFormatting` is selection-only by construction (nothing to clear otherwise). It strips known formatting markers from the selection.

`formatter.ts` exports pure functions operating on strings and cursor positions; no VS Code API calls. This keeps it unit-testable without a VS Code host.

### Commands registered in `extension.ts`

| Command ID | Title | Default binding | Default `when` |
|---|---|---|---|
| `markdownShortcuts.toggleBold` | Markdown Shortcuts: Toggle Bold | `ctrl+s ctrl+b` | `editorTextFocus && (editorLangId == markdown \|\| editorLangId == org)` |
| `markdownShortcuts.toggleItalic` | Markdown Shortcuts: Toggle Italic | `ctrl+s ctrl+i` | same |
| `markdownShortcuts.toggleCode` | Markdown Shortcuts: Toggle Code | `` ctrl+s ctrl+` `` | same |
| `markdownShortcuts.toggleStrikethrough` | Markdown Shortcuts: Toggle Strikethrough | `ctrl+s ctrl+-` | same |
| `markdownShortcuts.clearFormatting` | Markdown Shortcuts: Clear All Formatting | `ctrl+s ctrl+space` | `editorTextFocus && editorHasSelection && (editorLangId == markdown \|\| editorLangId == org)` |

All commands appear in the Command Palette and the Keyboard Shortcuts UI. When-clauses are shipped as sensible defaults; users may override in `keybindings.json` without any handler-side language check preventing them.

### Configuration schema (`package.json`)

Global:

- `markdownShortcuts.applyToSelectionOnly` (boolean, default `false`)

Per-language (documented as defaults for `[markdown]` and `[org]` scopes; users may override in `settings.json`):

- `markdownShortcuts.boldMarker`, `italicMarker`, `inlineCodeMarker`, `blockCodeOpen`, `blockCodeClose`, `blockCodeDefaultLanguage`, `strikethroughMarker`

The handler reads config via `vscode.workspace.getConfiguration('markdownShortcuts', document)` so language-scoped overrides resolve automatically.

### Tests (`test/suite/`)

- **Unit tests** (no VS Code host): exercise all branches of `formatter.ts` -- toggle on, toggle off, smart insert on empty selection, `applyToSelectionOnly` opt-out, inline vs block code detection, clear formatting.
- **Integration tests** (VS Code extension host): open a scratch Markdown and Orgmode document, execute each command via `vscode.commands.executeCommand`, assert the resulting text and cursor position.

`make test` entry point: `npm run test` (compiles TypeScript then runs `@vscode/test-electron`).

## Acceptance criteria

| ID | AC | Tests |
|---|---|---|
| AC1.1 | Given a non-empty selection in a Markdown document, invoking bold toggle wraps the selection with `**` when unwrapped, and strips the `**` when already wrapped. | ⏳ RT-1.1: unit -- bold wrap; RT-1.2: unit -- bold strip; UT-1.1: integration -- bold command |
| AC1.2 | Given an empty selection with `applyToSelectionOnly=false`, invoking any toggle command inserts prefix and suffix at the cursor and positions the cursor between them. | ⏳ RT-1.3: unit -- smart insert bold; RT-1.4: unit -- smart insert italic; RT-1.5: unit -- smart insert inline code; RT-1.6: unit -- smart insert strikethrough; RT-1.7: unit -- cursor position between markers |
| AC1.3 | Given an empty selection with `applyToSelectionOnly=true`, no toggle command modifies the document. | ⏳ RT-1.8: unit -- opt-out guard applies to all toggle commands |
| AC1.4 | Given a non-empty selection, italic toggle wraps or strips `*` (Markdown default) / `/` (Orgmode default). | ⏳ RT-1.9: unit -- italic Markdown; RT-1.10: unit -- italic Orgmode |
| AC1.5 | Given a single-line selection, code toggle wraps or strips inline markers. | ⏳ RT-1.11: unit -- inline code Markdown; RT-1.12: unit -- inline code Orgmode |
| AC1.6 | Given a multi-line selection, code toggle wraps or strips block markers on their own lines. | ⏳ RT-1.13: unit -- block code Markdown; RT-1.14: unit -- block code Orgmode; RT-1.15: unit -- block markers placed on separate lines |
| AC1.7 | Given a non-empty selection, strikethrough toggle wraps or strips `~~` (Markdown) / `+` (Orgmode). | ⏳ RT-1.16: unit -- strikethrough Markdown; RT-1.17: unit -- strikethrough Orgmode |
| AC1.8 | Given a non-empty selection containing known formatting markers, clear-formatting removes bold, italic, inline code, and strikethrough markers. | ⏳ RT-1.18: unit -- clear bold; RT-1.19: unit -- clear italic; RT-1.20: unit -- clear inline code; RT-1.21: unit -- clear strikethrough; RT-1.22: unit -- clear combined |
| AC1.9 | Given an empty selection, clear-formatting is a no-op regardless of `applyToSelectionOnly`. | ⏳ RT-1.23: unit -- clear formatting no-op |
| AC1.10 | Given custom marker configuration under a `[markdown]` or `[org]` scope in `settings.json`, the extension resolves and uses those markers via `vscode.workspace.getConfiguration('markdownShortcuts', document)` without any handler-side `languageId` branching. | ⏳ RT-1.24: unit -- custom marker resolution; UT-1.2: integration -- custom `[markdown]` bold marker applied |
| AC1.11 | Each command is registered with `contributes.commands` (with a user-facing title) and appears in the Command Palette and Keyboard Shortcuts UI. | ⏳ UT-1.3: integration -- command IDs registered; UT-1.4: manual -- Command Palette lookup |
| AC1.12 | Default keybindings ship with when-clauses restricting to `markdown` and `org`, but the command handler does not enforce language; rebinding the command in `keybindings.json` for another file type invokes the command normally. | ⏳ RT-1.25: unit -- handler runs regardless of languageId; UT-1.5: manual -- rebind and verify in `.txt` |
| AC1.13 | `npm run test` exits 0 with all tests passing. | ⏳ RT-1.26: build gate |

**Key:** ✅ passing · ⏳ pending · ❌ failing · ~~🚫 removed~~
