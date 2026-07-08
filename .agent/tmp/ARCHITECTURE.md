<!-- Version: 1.0 | Last updated: 2026-07-05 -->

# Architecture

## Overview

Markdown Formatting Shortcuts is a VS Code extension written in TypeScript. It registers a set of editor commands that toggle formatting markers around the current selection. The extension has no external runtime dependencies beyond the VS Code API.

## Project structure

```
vscode-markdown-formatting-shortcuts/
├── package.json          # Extension manifest: commands, keybindings, configuration schema
├── tsconfig.json         # TypeScript configuration
├── src/
│   ├── extension.ts      # Entry point: activates and registers all commands
│   ├── formatter.ts      # Core toggle logic: applies and strips formatting markers
│   └── config.ts         # Reads configuration values for the active document language
├── test/
│   └── suite/            # Mocha + @vscode/test-electron test suite
└── docs/
    ├── VISION.md
    └── ARCHITECTURE.md
```

## Key components

### `package.json` --- manifest

Defines:
- `contributes.commands` --- the command IDs exposed by the extension
- `contributes.keybindings` --- the default chord bindings (e.g. `ctrl+s ctrl+i` -> toggle italics)
- `contributes.configuration` --- the configuration schema, which VS Code surfaces in the Settings UI
- `activationEvents` --- the extension activates on language IDs `markdown` and `org`

### `src/extension.ts` --- entry point

Exports an `activate(context)` function. On activation it registers each formatting command (`toggleBold`, `toggleItalic`, `toggleCode`, `toggleStrikethrough`, `clearFormatting`) with `vscode.commands.registerTextEditorCommand`.

### `src/formatter.ts` --- toggle logic

The core of the extension. For each formatting type:

1. **Read selection.** Retrieve the current selection from the active text editor. If the selection is empty and `applyToSelectionOnly` is `true`, do nothing.
2. **Read markers.** Look up the configured prefix and suffix for the format and language.
3. **Detect state.** Check whether the selected text is already wrapped with the configured markers. If yes, strip them (toggle off). If no, wrap the selected text with them (toggle on).
4. **Code block special case.** For the code format, check whether the selection spans more than one line. If yes, use block markers (```` ``` ```` or `#+BEGIN_SRC`/`#+END_SRC`); otherwise use inline markers.
5. **Apply edit.** Replace the selection with the modified text using `editor.edit`.
6. **Reposition cursor.** After the edit, place the cursor inside the markers so typing can continue immediately.

### `src/config.ts` --- configuration

Reads the extension's settings via `vscode.workspace.getConfiguration`. Returns typed configuration objects for the active document's language (Markdown or Orgmode), falling back to the documented defaults if a setting is absent.

## Keybinding design

Keybindings are chord sequences: the first key is `ctrl+s`, the second selects the formatting type. The `ctrl+s` prefix was chosen because it is memorable (S for shortcut/style) and avoids conflicts with common single-key bindings.

| Shortcut | Command |
|---|---|
| `ctrl+s ctrl+i` | Toggle italic |
| `ctrl+s ctrl+b` | Toggle bold |
| `` ctrl+s ctrl+` `` | Toggle code (inline or block) |
| `ctrl+s ctrl+-` | Toggle strikethrough |
| `ctrl+s ctrl+space` | Clear all formatting |

> `ctrl+s` alone still triggers VS Code's built-in Save command. The chord only activates when the second key is pressed within VS Code's chord timeout.

## Language detection

The active document's language ID (available via `editor.document.languageId`) selects the correct delimiter set. The extension handles `markdown` and `org`.

## Configuration schema

| Key | Type | Default (Markdown) | Default (Orgmode) |
|---|---|---|---|
| `applyToSelectionOnly` | boolean | `true` | `true` |
| `boldMarker` | string | `**` | `*` |
| `italicMarker` | string | `*` | `/` |
| `inlineCodeMarker` | string | `` ` `` | `=` |
| `blockCodeOpen` | string | ```` ``` ```` | `#+BEGIN_SRC` |
| `blockCodeClose` | string | ```` ``` ```` | `#+END_SRC` |
| `blockCodeDefaultLanguage` | string | `""` | `""` |
| `strikethroughMarker` | string | `~~` | `+` |

## Testing strategy

Tests use the `@vscode/test-electron` harness with Mocha. The test suite exercises the formatter logic directly (unit tests on the toggle functions) and via the VS Code command API (integration tests with a real extension host). See `docs/TESTING.md` for the full testing strategy.

## Marketplace distribution

The extension is packaged with `@vscode/vsce` and published to the VS Code Marketplace under a registered publisher ID. A GitHub Actions workflow builds, packages, and publishes on tagged releases.
