import * as vscode from 'vscode';
import {
  Markers,
  ToggleResult,
  toggleFormat,
  toggleCode,
  clearFormatting
} from './formatter';
import { readConfig } from './config';

async function applyResult(
  editor: vscode.TextEditor,
  selection: vscode.Selection,
  result: ToggleResult | null
): Promise<void> {
  if (result === null) {
    return;
  }
  const startOffset = editor.document.offsetAt(selection.start);
  await editor.edit(builder => {
    if (selection.isEmpty) {
      builder.insert(selection.active, result.newText);
    } else {
      builder.replace(selection, result.newText);
    }
  });
  const finalPos = editor.document.positionAt(startOffset + result.cursorOffset);
  editor.selection = new vscode.Selection(finalPos, finalPos);
}

function toggleWith(pick: (cfg: ReturnType<typeof readConfig>) => Markers) {
  return async (): Promise<void> => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const cfg = readConfig(editor.document);
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    const result = toggleFormat(selectedText, pick(cfg), cfg.applyToSelectionOnly);
    await applyResult(editor, selection, result);
  };
}

async function doToggleCode(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const cfg = readConfig(editor.document);
  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);
  const result = toggleCode(selectedText, cfg.code, cfg.applyToSelectionOnly);
  await applyResult(editor, selection, result);
}

async function doClearFormatting(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const cfg = readConfig(editor.document);
  const selection = editor.selection;
  if (selection.isEmpty) {
    return;
  }
  const selectedText = editor.document.getText(selection);
  const result = clearFormatting(selectedText, cfg.all);
  await applyResult(editor, selection, result);
}

export function activate(context: vscode.ExtensionContext): void {
  const register = (id: string, handler: () => Promise<void>) => {
    context.subscriptions.push(vscode.commands.registerCommand(id, handler));
  };

  register('markdownShortcuts.toggleBold', toggleWith(c => c.bold));
  register('markdownShortcuts.toggleItalic', toggleWith(c => c.italic));
  register('markdownShortcuts.toggleStrikethrough', toggleWith(c => c.strikethrough));
  register('markdownShortcuts.toggleCode', doToggleCode);
  register('markdownShortcuts.clearFormatting', doClearFormatting);
}

export function deactivate(): void {
  // Nothing to clean up: all disposables are pushed to context.subscriptions.
}
