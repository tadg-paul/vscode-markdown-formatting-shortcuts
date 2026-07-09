import * as vscode from 'vscode';
import { Markers, FormattingMarkers, CodeConfig } from './formatter';

export interface ExtensionConfig {
  applyToSelectionOnly: boolean;
  bold: Markers;
  italic: Markers;
  strikethrough: Markers;
  code: CodeConfig;
  all: FormattingMarkers;
}

// Reads settings via vscode.workspace.getConfiguration with the document scope,
// so [markdown] and [org] overrides (including package.json configurationDefaults)
// resolve automatically without any languageId branching here.
export function readConfig(document: vscode.TextDocument): ExtensionConfig {
  const cfg = vscode.workspace.getConfiguration('markdownShortcuts', document);

  const same = (value: string): Markers => ({ prefix: value, suffix: value });

  const bold = same(cfg.get<string>('boldMarker', '**'));
  const italic = same(cfg.get<string>('italicMarker', '*'));
  const inlineCodeMarker = same(cfg.get<string>('inlineCodeMarker', '`'));
  const strikethrough = same(cfg.get<string>('strikethroughMarker', '~~'));

  const blockOpen = cfg.get<string>('blockCodeOpen', '```');
  const blockClose = cfg.get<string>('blockCodeClose', '```');
  const blockDefaultLanguage = cfg.get<string>('blockCodeDefaultLanguage', '');

  return {
    applyToSelectionOnly: cfg.get<boolean>('applyToSelectionOnly', false),
    bold,
    italic,
    strikethrough,
    code: {
      inline: inlineCodeMarker,
      block: { prefix: blockOpen, suffix: blockClose },
      blockDefaultLanguage
    },
    all: {
      bold,
      italic,
      inlineCode: inlineCodeMarker,
      strikethrough
    }
  };
}
