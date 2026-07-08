<!-- Version: 1.0 | Last updated: 2026-07-05 -->

# Vision

## Problem

Composing Markdown and Orgmode documents in VS Code requires frequent interruptions to apply inline formatting. Applying bold, italic, or code formatting typically means either reaching for the mouse to use a menu, or manually typing delimiter characters and repositioning the cursor. Neither fits a keyboard-driven writing flow.

## Solution

Markdown Formatting Shortcuts provides a set of chord-based keyboard shortcuts that toggle formatting markers on selected text with a single two-key sequence. Formatting is applied and removed by the same shortcut, and the extension makes intelligent decisions about inline vs. block code based on selection context.

## Goals

1. **Frictionless formatting.** Formatting applied or removed in a single keystroke, without breaking writing flow.
2. **Dual-format support.** First-class support for both Markdown and Orgmode, with the correct delimiters used automatically based on the document language.
3. **Configurable delimiters.** All delimiter pairs are configurable per language, covering variant preferences (e.g. `__bold__` vs `**bold**` in Markdown).
4. **Minimal footprint.** The extension does one thing: toggle formatting markers. It introduces no UI chrome and does not modify files except on explicit user action.

## Target users

- Developers writing documentation, changelogs, and READMEs in Markdown.
- Note-takers and knowledge-base authors using Markdown or Orgmode in VS Code.
- Writers who prefer the keyboard and dislike context switches to apply formatting.

## Success criteria

- All specified formatting types (bold, italic, code, strikethrough, clear) work correctly in Markdown and Orgmode documents.
- Extension is published to the VS Code Marketplace.
- Configuration options are documented and exposed through the VS Code settings UI.
- The extension handles edge cases gracefully: empty selection, multi-line selection for inline formats, cursor repositioning after toggle.
