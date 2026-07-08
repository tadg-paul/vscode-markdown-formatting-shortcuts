# Markdown Formatting Shortcuts

A VS Code extension providing keyboard shortcuts to toggle Markdown and Orgmode inline formatting --- bold, italic, code, and strikethrough --- without reaching for the mouse.

## Features

| Shortcut | Action |
|---|---|
| `ctrl+s ctrl+i` | Toggle italic |
| `ctrl+s ctrl+b` | Toggle bold |
| `` ctrl+s ctrl+` `` | Toggle code (inline or block) |
| `ctrl+s ctrl+-` | Toggle strikethrough |
| `ctrl+s ctrl+space` | Clear all formatting _(optional)_ |

Code formatting is smart: a single-line selection uses inline markers (`` ` `` or `=`); a multi-line selection uses block markers (```` ``` ```` or `#+BEGIN_SRC … #+END_SRC`).

## Supported languages

- **Markdown** (`.md`)
- **Orgmode** (`.org`)

## Configuration

All delimiter pairs are configurable in VS Code Settings (`File → Preferences → Settings`, search for `markdownShortcuts`).

### Common settings

| Setting | Default | Description |
|---|---|---|
| `applyToSelectionOnly` | `true` | When `true`, shortcuts do nothing if no text is selected |

### Markdown defaults

| Setting | Default |
|---|---|
| `boldMarker` | `**` |
| `italicMarker` | `*` |
| `inlineCodeMarker` | `` ` `` |
| `blockCodeOpen` / `blockCodeClose` | ```` ``` ```` |
| `strikethroughMarker` | `~~` |

### Orgmode defaults

| Setting | Default |
|---|---|
| `boldMarker` | `*` |
| `italicMarker` | `/` |
| `inlineCodeMarker` | `=` |
| `blockCodeOpen` | `#+BEGIN_SRC` |
| `blockCodeClose` | `#+END_SRC` |
| `strikethroughMarker` | `+` |

## Documentation

- [Vision](docs/VISION.md) --- project goals and target users
- [Architecture](docs/ARCHITECTURE.md) --- technical design

## Development

See [Architecture](docs/ARCHITECTURE.md) for project structure and design decisions.

```bash
npm install
npm run compile
npm test
```

## Licence

MIT © Taḋg Paul
