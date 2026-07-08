import * as vscode from 'vscode';

// STUB — commands register but do nothing. Implemented in green phase.

export function activate(context: vscode.ExtensionContext): void {
  const ids = [
    'markdownShortcuts.toggleBold',
    'markdownShortcuts.toggleItalic',
    'markdownShortcuts.toggleCode',
    'markdownShortcuts.toggleStrikethrough',
    'markdownShortcuts.clearFormatting'
  ];
  for (const id of ids) {
    context.subscriptions.push(vscode.commands.registerCommand(id, () => { /* stub */ }));
  }
}

export function deactivate(): void { /* nothing to clean up */ }
