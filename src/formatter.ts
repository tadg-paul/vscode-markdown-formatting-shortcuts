export interface Markers {
  prefix: string;
  suffix: string;
}

export interface ToggleResult {
  newText: string;
  cursorOffset: number;
}

export interface FormattingMarkers {
  bold: Markers;
  italic: Markers;
  inlineCode: Markers;
  strikethrough: Markers;
}

export interface CodeConfig {
  inline: Markers;
  block: Markers;
  blockDefaultLanguage: string;
}

function isWrappedWith(text: string, markers: Markers): boolean {
  const minLength = markers.prefix.length + markers.suffix.length;
  return (
    text.length >= minLength &&
    text.startsWith(markers.prefix) &&
    text.endsWith(markers.suffix)
  );
}

function stripWrap(text: string, markers: Markers): string {
  return text.slice(markers.prefix.length, text.length - markers.suffix.length);
}

export function toggleFormat(
  selectedText: string,
  markers: Markers,
  applyToSelectionOnly: boolean
): ToggleResult | null {
  if (selectedText.length === 0) {
    if (applyToSelectionOnly) {
      return null;
    }
    return {
      newText: markers.prefix + markers.suffix,
      cursorOffset: markers.prefix.length
    };
  }

  if (isWrappedWith(selectedText, markers)) {
    const stripped = stripWrap(selectedText, markers);
    return { newText: stripped, cursorOffset: stripped.length };
  }

  const wrapped = markers.prefix + selectedText + markers.suffix;
  return { newText: wrapped, cursorOffset: wrapped.length };
}

function isBlockWrapped(text: string, block: Markers): boolean {
  const openMatch = new RegExp(
    '^' + escapeRegex(block.prefix) + '[^\\n]*\\n'
  ).exec(text);
  const closePrefix = '\n' + block.suffix;
  return openMatch !== null && text.endsWith(closePrefix);
}

function stripBlockWrap(text: string, block: Markers): string {
  const openMatch = new RegExp(
    '^' + escapeRegex(block.prefix) + '[^\\n]*\\n'
  ).exec(text)!;
  const afterOpen = text.slice(openMatch[0].length);
  return afterOpen.slice(0, afterOpen.length - ('\n' + block.suffix).length);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function toggleCode(
  selectedText: string,
  config: CodeConfig,
  applyToSelectionOnly: boolean
): ToggleResult | null {
  const isMultiline = selectedText.includes('\n');

  if (selectedText.length === 0) {
    return toggleFormat('', config.inline, applyToSelectionOnly);
  }

  if (isMultiline) {
    if (isBlockWrapped(selectedText, config.block)) {
      const stripped = stripBlockWrap(selectedText, config.block);
      return { newText: stripped, cursorOffset: stripped.length };
    }
    const openLine = config.block.prefix + (config.blockDefaultLanguage || '');
    const wrapped = openLine + '\n' + selectedText + '\n' + config.block.suffix;
    return { newText: wrapped, cursorOffset: wrapped.length };
  }

  return toggleFormat(selectedText, config.inline, applyToSelectionOnly);
}

export function clearFormatting(
  selectedText: string,
  markers: FormattingMarkers
): ToggleResult | null {
  if (selectedText.length === 0) {
    return null;
  }

  const ordered: Markers[] = [
    markers.bold,
    markers.inlineCode,
    markers.strikethrough,
    markers.italic
  ];

  let text = selectedText;
  let changed = true;
  while (changed) {
    changed = false;
    for (const m of ordered) {
      if (isWrappedWith(text, m)) {
        text = stripWrap(text, m);
        changed = true;
      }
    }
  }

  return { newText: text, cursorOffset: text.length };
}
