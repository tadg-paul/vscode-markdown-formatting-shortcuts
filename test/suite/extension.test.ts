import * as assert from 'assert';
import * as vscode from 'vscode';

async function openScratch(language: string, content: string): Promise<vscode.TextEditor> {
  const doc = await vscode.workspace.openTextDocument({ language, content });
  return vscode.window.showTextDocument(doc);
}

function selectRange(
  editor: vscode.TextEditor,
  startLine: number,
  startChar: number,
  endLine: number,
  endChar: number
): void {
  editor.selection = new vscode.Selection(startLine, startChar, endLine, endChar);
}

describe('extension integration', () => {
  after(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  it('AC1.1 UT-1.1: toggleBold command wraps a Markdown selection with **', async () => {
    const editor = await openScratch('markdown', 'hello world');
    selectRange(editor, 0, 0, 0, 5);
    await vscode.commands.executeCommand('markdownShortcuts.toggleBold');
    assert.strictEqual(editor.document.getText(), '**hello** world');
  });

  it('AC1.11 UT-1.3: all five command IDs are registered', async () => {
    const cmds = await vscode.commands.getCommands(true);
    const required = [
      'markdownShortcuts.toggleBold',
      'markdownShortcuts.toggleItalic',
      'markdownShortcuts.toggleCode',
      'markdownShortcuts.toggleStrikethrough',
      'markdownShortcuts.clearFormatting'
    ];
    for (const id of required) {
      assert.ok(cmds.includes(id), `command ${id} is not registered`);
    }
  });

  it('AC1.10 UT-1.2: toggleBold respects a workspace-configured [markdown] boldMarker override', async () => {
    const config = vscode.workspace.getConfiguration('markdownShortcuts');
    await config.update('boldMarker', '__', vscode.ConfigurationTarget.Workspace);
    try {
      const editor = await openScratch('markdown', 'hello');
      selectRange(editor, 0, 0, 0, 5);
      await vscode.commands.executeCommand('markdownShortcuts.toggleBold');
      assert.strictEqual(editor.document.getText(), '__hello__');
    } finally {
      await config.update('boldMarker', undefined, vscode.ConfigurationTarget.Workspace);
    }
  });

  it('AC1.5: toggleCode wraps a single-line Markdown selection with inline backticks', async () => {
    const editor = await openScratch('markdown', 'let x = 1');
    selectRange(editor, 0, 0, 0, 9);
    await vscode.commands.executeCommand('markdownShortcuts.toggleCode');
    assert.strictEqual(editor.document.getText(), '`let x = 1`');
  });

  it('AC1.6: toggleCode wraps a multi-line Markdown selection with block fences', async () => {
    const editor = await openScratch('markdown', 'line1\nline2');
    selectRange(editor, 0, 0, 1, 5);
    await vscode.commands.executeCommand('markdownShortcuts.toggleCode');
    assert.strictEqual(editor.document.getText(), '```\nline1\nline2\n```');
  });

  it('AC1.2: toggleBold with no selection inserts markers and positions cursor between them', async () => {
    const editor = await openScratch('markdown', '');
    selectRange(editor, 0, 0, 0, 0);
    await vscode.commands.executeCommand('markdownShortcuts.toggleBold');
    assert.strictEqual(editor.document.getText(), '****');
    assert.strictEqual(editor.selection.active.character, 2);
  });

  it('AC1.3: toggleBold with no selection and applyToSelectionOnly=true is a no-op', async () => {
    const config = vscode.workspace.getConfiguration('markdownShortcuts');
    await config.update('applyToSelectionOnly', true, vscode.ConfigurationTarget.Workspace);
    try {
      const editor = await openScratch('markdown', 'text');
      selectRange(editor, 0, 4, 0, 4);
      await vscode.commands.executeCommand('markdownShortcuts.toggleBold');
      assert.strictEqual(editor.document.getText(), 'text');
    } finally {
      await config.update('applyToSelectionOnly', undefined, vscode.ConfigurationTarget.Workspace);
    }
  });

  it('AC1.8: clearFormatting strips markers from a selection', async () => {
    const editor = await openScratch('markdown', '**bold** normal');
    selectRange(editor, 0, 0, 0, 8);
    await vscode.commands.executeCommand('markdownShortcuts.clearFormatting');
    assert.strictEqual(editor.document.getText(), 'bold normal');
  });
});
