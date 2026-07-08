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

1. **Read selection.** Retrieve the current selection from the active text editor.
2. **Read markers.** Look up the configured prefix and suffix for the format via language-scoped configuration (see `config.ts`). The handler does not branch on `languageId`.
3. **Branch on selection state:**
    - **Empty selection** (and `applyToSelectionOnly` is `false`, the default): insert prefix and suffix at the cursor position and place the cursor between them, ready for typing. This is the "smart insert" behaviour.
    - **Empty selection** with `applyToSelectionOnly` set to `true`: do nothing.
    - **Non-empty selection wrapped in the markers already:** strip them (toggle off).
    - **Non-empty selection not wrapped:** wrap it with the markers (toggle on).
4. **Code block special case.** The `toggleCode` command auto-selects inline vs block markers based on selection span:
    - Empty or single-line selection -> inline markers (`` ` `` or `=`).
    - Multi-line selection -> block markers (```` ``` ```` or `#+BEGIN_SRC`/`#+END_SRC`).
5. **Clear formatting.** Strips all known formatting markers (bold, italic, inline code, strikethrough) from the selection. Requires a non-empty selection; a no-op otherwise regardless of `applyToSelectionOnly`.
6. **Apply edit.** Replace the selection with the modified text using `editor.edit`.
7. **Reposition cursor.** After the edit, place the cursor inside the markers (or at the end of the wrapped text) so typing can continue immediately.

### `src/config.ts` --- configuration

Reads the extension's settings via `vscode.workspace.getConfiguration('markdownShortcuts', document)`. The `document` argument lets VS Code resolve language-scoped settings automatically:

```json
"[markdown]": { "markdownShortcuts.boldMarker": "**" },
"[org]":      { "markdownShortcuts.boldMarker": "*"  }
```

This decouples delimiter resolution from the handler: no `if (languageId === 'markdown')` branching. Users can add configuration for additional file types (`[latex]`, `[rst]`, etc.) without an extension change.

## Keybinding design

Keybindings are chord sequences: the first key is `ctrl+s`, the second selects the formatting type. The `ctrl+s` prefix was chosen because it is memorable (S for shortcut/style) and avoids conflicts with common single-key bindings.

| Shortcut | Command | Default `when` clause |
|---|---|---|
| `ctrl+s ctrl+i` | Toggle italic | `editorTextFocus && (editorLangId == markdown \|\| editorLangId == org)` |
| `ctrl+s ctrl+b` | Toggle bold | same |
| `` ctrl+s ctrl+` `` | Toggle code (inline or block) | same |
| `ctrl+s ctrl+-` | Toggle strikethrough | same |
| `ctrl+s ctrl+space` | Clear all formatting | `editorTextFocus && editorHasSelection && (editorLangId == markdown \|\| editorLangId == org)` |

> `ctrl+s` alone still triggers VS Code's built-in Save command. The chord only activates when the second key is pressed within VS Code's chord timeout, and only in Markdown or Orgmode documents.

Users can override any of these via the Keyboard Shortcuts UI or `keybindings.json`. The when-clauses are shipped as sensible defaults, not hard-coded restrictions: dropping the when-clause on a user rebinding will simply invoke the command in whatever context the user chose, and the language-scoped configuration will supply appropriate delimiters (see below).

## Language scoping

The extension is language-agnostic at the handler level. Language selection happens in two independent places:

1. **When-clauses in default keybindings** restrict where the shortcuts fire out of the box (`markdown` and `org`).
2. **Language-scoped configuration** supplies the right delimiter set for the document's language.

There is deliberately no `if (languageId === 'markdown')` check inside the command handler. This design avoids rigidity: users who want the shortcuts in another file type can rebind and add language-scoped config, without any extension code change.

## Configuration schema

Global settings (not language-scoped):

| Key | Type | Default | Notes |
|---|---|---|---|
| `markdownShortcuts.applyToSelectionOnly` | boolean | `false` | When `true`, commands do nothing on empty selection (strict mode). When `false` (default), commands insert markers at the cursor position. |

Per-language settings --- the defaults shown apply when the setting is placed inside `"[markdown]"` or `"[org]"` blocks in `settings.json`:

| Key | Default (Markdown) | Default (Orgmode) |
|---|---|---|
| `markdownShortcuts.boldMarker` | `**` | `*` |
| `markdownShortcuts.italicMarker` | `*` | `/` |
| `markdownShortcuts.inlineCodeMarker` | `` ` `` | `=` |
| `markdownShortcuts.blockCodeOpen` | ```` ``` ```` | `#+BEGIN_SRC` |
| `markdownShortcuts.blockCodeClose` | ```` ``` ```` | `#+END_SRC` |
| `markdownShortcuts.blockCodeDefaultLanguage` | `""` | `""` |
| `markdownShortcuts.strikethroughMarker` | `~~` | `+` |

## Testing strategy

Tests use the `@vscode/test-electron` harness with Mocha. The test suite exercises the formatter logic directly (unit tests on the toggle functions) and via the VS Code command API (integration tests with a real extension host). See `docs/TESTING.md` for the full testing strategy.

## Marketplace distribution

The extension is packaged with `@vscode/vsce` and published to the VS Code Marketplace under a registered publisher ID. A GitHub Actions workflow builds, packages, and publishes on tagged releases.
