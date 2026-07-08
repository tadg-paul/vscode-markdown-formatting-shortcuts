import * as vscode from 'vscode';
import { Markers, FormattingMarkers, CodeConfig } from './formatter';

// STUB — implemented in green phase.

export interface ExtensionConfig {
  applyToSelectionOnly: boolean;
  bold: Markers;
  italic: Markers;
  strikethrough: Markers;
  code: CodeConfig;
  all: FormattingMarkers;
}

export function readConfig(_document: vscode.TextDocument): ExtensionConfig {
  return {
    applyToSelectionOnly: false,
    bold: { prefix: 'STUB', suffix: 'STUB' },
    italic: { prefix: 'STUB', suffix: 'STUB' },
    strikethrough: { prefix: 'STUB', suffix: 'STUB' },
    code: {
      inline: { prefix: 'STUB', suffix: 'STUB' },
      block: { prefix: 'STUB', suffix: 'STUB' },
      blockDefaultLanguage: ''
    },
    all: {
      bold: { prefix: 'STUB', suffix: 'STUB' },
      italic: { prefix: 'STUB', suffix: 'STUB' },
      inlineCode: { prefix: 'STUB', suffix: 'STUB' },
      strikethrough: { prefix: 'STUB', suffix: 'STUB' }
    }
  };
}
