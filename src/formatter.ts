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

// STUB — implemented in green phase. Returns wrong values so the red tests fail meaningfully.
export function toggleFormat(
  _selectedText: string,
  _markers: Markers,
  _applyToSelectionOnly: boolean
): ToggleResult | null {
  return { newText: 'STUB', cursorOffset: 0 };
}

// STUB
export function toggleCode(
  _selectedText: string,
  _config: CodeConfig,
  _applyToSelectionOnly: boolean
): ToggleResult | null {
  return { newText: 'STUB', cursorOffset: 0 };
}

// STUB
export function clearFormatting(
  _selectedText: string,
  _markers: FormattingMarkers
): ToggleResult | null {
  return { newText: 'STUB', cursorOffset: 0 };
}
