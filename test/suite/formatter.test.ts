import * as assert from 'assert';
import {
  toggleFormat,
  toggleCode,
  clearFormatting,
  Markers,
  FormattingMarkers,
  CodeConfig
} from '../../src/formatter';

const bold: Markers = { prefix: '**', suffix: '**' };
const italic: Markers = { prefix: '*', suffix: '*' };
const inlineCode: Markers = { prefix: '`', suffix: '`' };
const strikethrough: Markers = { prefix: '~~', suffix: '~~' };

const orgBold: Markers = { prefix: '*', suffix: '*' };
const orgItalic: Markers = { prefix: '/', suffix: '/' };
const orgStrikethrough: Markers = { prefix: '+', suffix: '+' };

const mdCode: CodeConfig = {
  inline: { prefix: '`', suffix: '`' },
  block: { prefix: '```', suffix: '```' },
  blockDefaultLanguage: ''
};

const orgCode: CodeConfig = {
  inline: { prefix: '=', suffix: '=' },
  block: { prefix: '#+BEGIN_SRC', suffix: '#+END_SRC' },
  blockDefaultLanguage: ''
};

describe('formatter.toggleFormat', () => {
  it('AC1.1 RT-1.1: wraps a non-empty selection with the bold prefix and suffix', () => {
    const result = toggleFormat('hello', bold, false);
    assert.deepStrictEqual(result, { newText: '**hello**', cursorOffset: 9 });
  });

  it('AC1.1 RT-1.2: strips bold markers from an already-wrapped selection', () => {
    const result = toggleFormat('**hello**', bold, false);
    assert.deepStrictEqual(result, { newText: 'hello', cursorOffset: 5 });
  });

  it('AC1.2 RT-1.3: inserts bold markers with cursor between on empty selection', () => {
    const result = toggleFormat('', bold, false);
    assert.deepStrictEqual(result, { newText: '****', cursorOffset: 2 });
  });

  it('AC1.2 RT-1.4: inserts italic markers with cursor between on empty selection', () => {
    const result = toggleFormat('', italic, false);
    assert.deepStrictEqual(result, { newText: '**', cursorOffset: 1 });
  });

  it('AC1.2 RT-1.5: inserts inline code markers with cursor between on empty selection', () => {
    const result = toggleFormat('', inlineCode, false);
    assert.deepStrictEqual(result, { newText: '``', cursorOffset: 1 });
  });

  it('AC1.2 RT-1.6: inserts strikethrough markers with cursor between on empty selection', () => {
    const result = toggleFormat('', strikethrough, false);
    assert.deepStrictEqual(result, { newText: '~~~~', cursorOffset: 2 });
  });

  it('AC1.2 RT-1.7: cursor lands between markers for asymmetric prefix/suffix', () => {
    const asymmetric: Markers = { prefix: '<<', suffix: '>>' };
    const result = toggleFormat('', asymmetric, false);
    assert.deepStrictEqual(result, { newText: '<<>>', cursorOffset: 2 });
  });

  it('AC1.3 RT-1.8: returns null on empty selection when applyToSelectionOnly is true', () => {
    assert.strictEqual(toggleFormat('', bold, true), null);
    assert.strictEqual(toggleFormat('', italic, true), null);
    assert.strictEqual(toggleFormat('', inlineCode, true), null);
    assert.strictEqual(toggleFormat('', strikethrough, true), null);
  });

  it('AC1.4 RT-1.9: wraps and strips italic with the Markdown default marker', () => {
    const wrapped = toggleFormat('word', italic, false);
    assert.deepStrictEqual(wrapped, { newText: '*word*', cursorOffset: 6 });
    const stripped = toggleFormat('*word*', italic, false);
    assert.deepStrictEqual(stripped, { newText: 'word', cursorOffset: 4 });
  });

  it('AC1.4 RT-1.10: wraps and strips italic with the Orgmode default marker', () => {
    const wrapped = toggleFormat('word', orgItalic, false);
    assert.deepStrictEqual(wrapped, { newText: '/word/', cursorOffset: 6 });
    const stripped = toggleFormat('/word/', orgItalic, false);
    assert.deepStrictEqual(stripped, { newText: 'word', cursorOffset: 4 });
  });

  it('AC1.7 RT-1.16: wraps and strips strikethrough with the Markdown marker', () => {
    const wrapped = toggleFormat('gone', strikethrough, false);
    assert.deepStrictEqual(wrapped, { newText: '~~gone~~', cursorOffset: 8 });
    const stripped = toggleFormat('~~gone~~', strikethrough, false);
    assert.deepStrictEqual(stripped, { newText: 'gone', cursorOffset: 4 });
  });

  it('AC1.7 RT-1.17: wraps and strips strikethrough with the Orgmode marker', () => {
    const wrapped = toggleFormat('gone', orgStrikethrough, false);
    assert.deepStrictEqual(wrapped, { newText: '+gone+', cursorOffset: 6 });
    const stripped = toggleFormat('+gone+', orgStrikethrough, false);
    assert.deepStrictEqual(stripped, { newText: 'gone', cursorOffset: 4 });
  });

  it('AC1.10 RT-1.24: uses whatever markers are supplied without hard-coded assumptions', () => {
    const custom: Markers = { prefix: '__', suffix: '__' };
    const wrapped = toggleFormat('x', custom, false);
    assert.deepStrictEqual(wrapped, { newText: '__x__', cursorOffset: 5 });
    const stripped = toggleFormat('__x__', custom, false);
    assert.deepStrictEqual(stripped, { newText: 'x', cursorOffset: 1 });
  });

  it('AC1.12 RT-1.25: toggleFormat has no languageId parameter and behaves purely on markers', () => {
    // Orgmode markers applied irrespective of any "language" context.
    const wrapped = toggleFormat('foo', orgBold, false);
    assert.strictEqual(wrapped?.newText, '*foo*');
  });
});

describe('formatter.toggleCode', () => {
  it('AC1.5 RT-1.11: wraps and strips inline code in Markdown', () => {
    const wrapped = toggleCode('x = 1', mdCode, false);
    assert.deepStrictEqual(wrapped, { newText: '`x = 1`', cursorOffset: 7 });
    const stripped = toggleCode('`x = 1`', mdCode, false);
    assert.deepStrictEqual(stripped, { newText: 'x = 1', cursorOffset: 5 });
  });

  it('AC1.5 RT-1.12: wraps and strips inline code in Orgmode', () => {
    const wrapped = toggleCode('x = 1', orgCode, false);
    assert.deepStrictEqual(wrapped, { newText: '=x = 1=', cursorOffset: 7 });
    const stripped = toggleCode('=x = 1=', orgCode, false);
    assert.deepStrictEqual(stripped, { newText: 'x = 1', cursorOffset: 5 });
  });

  it('AC1.6 RT-1.13: wraps a multi-line selection in Markdown block code fences', () => {
    const result = toggleCode('line1\nline2', mdCode, false);
    assert.strictEqual(result?.newText, '```\nline1\nline2\n```');
  });

  it('AC1.6 RT-1.14: wraps a multi-line selection in Orgmode block source fences', () => {
    const result = toggleCode('line1\nline2', orgCode, false);
    assert.strictEqual(result?.newText, '#+BEGIN_SRC\nline1\nline2\n#+END_SRC');
  });

  it('AC1.6 RT-1.15: block markers are placed on their own lines above and below the selection', () => {
    const result = toggleCode('line1\nline2', mdCode, false);
    const lines = result?.newText.split('\n');
    assert.deepStrictEqual(lines, ['```', 'line1', 'line2', '```']);
  });

  it('AC1.6: strips block code markers from a wrapped multi-line selection (Markdown)', () => {
    const result = toggleCode('```\nline1\nline2\n```', mdCode, false);
    assert.strictEqual(result?.newText, 'line1\nline2');
  });

  it('AC1.6: strips block code markers from a wrapped multi-line selection (Orgmode)', () => {
    const result = toggleCode('#+BEGIN_SRC\nline1\nline2\n#+END_SRC', orgCode, false);
    assert.strictEqual(result?.newText, 'line1\nline2');
  });

  it('AC1.6: block-wrap respects blockCodeDefaultLanguage when set (Markdown)', () => {
    const withLang: CodeConfig = { ...mdCode, blockDefaultLanguage: 'typescript' };
    const result = toggleCode('line1\nline2', withLang, false);
    assert.strictEqual(result?.newText, '```typescript\nline1\nline2\n```');
  });

  it('AC1.2 RT-1.5 (code): inserts inline code markers on empty selection with cursor between', () => {
    const result = toggleCode('', mdCode, false);
    assert.deepStrictEqual(result, { newText: '``', cursorOffset: 1 });
  });

  it('AC1.3 (code): returns null on empty selection when applyToSelectionOnly is true', () => {
    assert.strictEqual(toggleCode('', mdCode, true), null);
  });
});

describe('formatter.clearFormatting', () => {
  const all: FormattingMarkers = {
    bold: { prefix: '**', suffix: '**' },
    italic: { prefix: '*', suffix: '*' },
    inlineCode: { prefix: '`', suffix: '`' },
    strikethrough: { prefix: '~~', suffix: '~~' }
  };

  it('AC1.8 RT-1.18: strips bold markers from the selection', () => {
    const result = clearFormatting('**hello**', all);
    assert.strictEqual(result?.newText, 'hello');
  });

  it('AC1.8 RT-1.19: strips italic markers from the selection', () => {
    const result = clearFormatting('*hello*', all);
    assert.strictEqual(result?.newText, 'hello');
  });

  it('AC1.8 RT-1.20: strips inline code markers from the selection', () => {
    const result = clearFormatting('`hello`', all);
    assert.strictEqual(result?.newText, 'hello');
  });

  it('AC1.8 RT-1.21: strips strikethrough markers from the selection', () => {
    const result = clearFormatting('~~hello~~', all);
    assert.strictEqual(result?.newText, 'hello');
  });

  it('AC1.8 RT-1.22: strips combined markers from the selection', () => {
    const result = clearFormatting('**~~hello~~**', all);
    assert.strictEqual(result?.newText, 'hello');
  });

  it('AC1.9 RT-1.23: returns null for an empty selection', () => {
    assert.strictEqual(clearFormatting('', all), null);
  });

  it('AC1.9: leaves unformatted text unchanged', () => {
    const result = clearFormatting('plain', all);
    assert.strictEqual(result?.newText, 'plain');
  });
});
