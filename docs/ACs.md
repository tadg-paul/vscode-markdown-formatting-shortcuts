<!-- Version: 1.0 | Last updated: 2026-07-11 -->

# Acceptance Criteria

This is the canonical spec. ACs introduced from 2026-07-11 onward live here.
Pre-cutover ACs remain in their originating issues until cited or migrated.

Last migrated: AC1.13 from #1 on 2026-07-11

---

## Toggle commands

### AC1.1 - Given a non-empty selection in a Markdown document, invoking bold toggle wraps the selection with `**` when unwrapped, and strips the `**` when already wrapped.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.1: unit -- bold wrap
  - ✅ RT-1.2: unit -- bold strip
  - ✅ UT-1.1: integration -- bold command

### AC1.2 - Given an empty selection with `applyToSelectionOnly=false`, invoking any toggle command inserts prefix and suffix at the cursor and positions the cursor between them.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.3: unit -- smart insert bold
  - ✅ RT-1.4: unit -- smart insert italic
  - ✅ RT-1.5: unit -- smart insert inline code
  - ✅ RT-1.6: unit -- smart insert strikethrough
  - ✅ RT-1.7: unit -- cursor position between markers

### AC1.3 - Given an empty selection with `applyToSelectionOnly=true`, no toggle command modifies the document.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.8: unit -- opt-out guard applies to all toggle commands

### AC1.4 - Given a non-empty selection, italic toggle wraps or strips `*` (Markdown default) / `/` (Orgmode default).
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.9: unit -- italic Markdown
  - ✅ RT-1.10: unit -- italic Orgmode

### AC1.7 - Given a non-empty selection, strikethrough toggle wraps or strips `~~` (Markdown) / `+` (Orgmode).
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.16: unit -- strikethrough Markdown
  - ✅ RT-1.17: unit -- strikethrough Orgmode

---

## Code toggle

### AC1.5 - Given a single-line selection, code toggle wraps or strips inline markers.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.11: unit -- inline code Markdown
  - ✅ RT-1.12: unit -- inline code Orgmode

### AC1.6 - Given a multi-line selection, code toggle wraps or strips block markers on their own lines.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.13: unit -- block code Markdown
  - ✅ RT-1.14: unit -- block code Orgmode
  - ✅ RT-1.15: unit -- block markers placed on separate lines

---

## Clear formatting

### AC1.8 - Given a non-empty selection containing known formatting markers, clear-formatting removes bold, italic, inline code, and strikethrough markers.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.18: unit -- clear bold
  - ✅ RT-1.19: unit -- clear italic
  - ✅ RT-1.20: unit -- clear inline code
  - ✅ RT-1.21: unit -- clear strikethrough
  - ✅ RT-1.22: unit -- clear combined

### AC1.9 - Given an empty selection, clear-formatting is a no-op regardless of `applyToSelectionOnly`.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.23: unit -- clear formatting no-op

---

## Configuration and language scope

### AC1.10 - Given custom marker configuration under a `[markdown]` or `[org]` scope in `settings.json`, the extension resolves and uses those markers via `vscode.workspace.getConfiguration('markdownShortcuts', document)` without any handler-side `languageId` branching.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.24: unit -- custom marker resolution
  - ⏳ UT-1.2: integration -- custom `[markdown]` bold marker applied

### AC1.12 - Default keybindings ship with when-clauses restricting to `markdown` and `org`, but the command handler does not enforce language; rebinding the command in `keybindings.json` for another file type invokes the command normally.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.25: unit -- handler runs regardless of languageId
  - ⏳ UT-1.5: manual -- rebind and verify in `.txt`

---

## Command registration

### AC1.11 - Each command is registered with `contributes.commands` (with a user-facing title) and appears in the Command Palette and Keyboard Shortcuts UI.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ UT-1.3: integration -- command IDs registered
  - ✅ UT-1.4: manual -- Command Palette lookup

---

## Build gate

### AC1.13 - `npm run test` exits 0 with all tests passing.
- Introduced: #1 (closed 2026-07-11)
- Migrated: 2026-07-11
- Tests:
  - ✅ RT-1.26: build gate

---

**Key:** ✅ passing · ⏳ pending · ❌ failing · ~~🚫 removed~~
