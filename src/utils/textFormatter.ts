/**
 * Text formatting utilities for social media posts & blog CMS.
 *
 * Supports:
 * - Unicode formatting (Bold, Italic, Strikethrough, Underline, Monospace)
 *   which renders natively in LinkedIn, X (Twitter), and Facebook feeds.
 * - Markdown formatting (Bold, Italic, Strikethrough, Code) for Website/CMS.
 * - List transformations (Bullets, Numbered).
 * - Quote/Callout transformations.
 * - Case transformations (Title Case, Uppercase).
 * - Clear formatting back to clean plain text.
 */

export type FormatMode = 'unicode' | 'markdown';

// --- Unicode Conversion Maps ---
const BOLD_CAPS_OFFSET = 120211; // 0x1D5D4 - 65
const BOLD_LOW_OFFSET = 120205;  // 0x1D5EE - 97
const BOLD_DIGIT_OFFSET = 120764; // 0x1D7EC - 48

const ITALIC_CAPS_OFFSET = 120263; // 0x1D608 - 65
const ITALIC_LOW_OFFSET = 120257;  // 0x1D622 - 97

const MONO_CAPS_OFFSET = 120367; // 0x1D670 - 65
const MONO_LOW_OFFSET = 120361;  // 0x1D68A - 97
const MONO_DIGIT_OFFSET = 120774; // 0x1D7F6 - 48

export function toUnicodeBold(text: string): string {
  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      result += String.fromCodePoint(code + BOLD_CAPS_OFFSET);
    } else if (code >= 97 && code <= 122) {
      result += String.fromCodePoint(code + BOLD_LOW_OFFSET);
    } else if (code >= 48 && code <= 57) {
      result += String.fromCodePoint(code + BOLD_DIGIT_OFFSET);
    } else {
      result += char;
    }
  }
  return result;
}

export function toUnicodeItalic(text: string): string {
  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      result += String.fromCodePoint(code + ITALIC_CAPS_OFFSET);
    } else if (code >= 97 && code <= 122) {
      result += String.fromCodePoint(code + ITALIC_LOW_OFFSET);
    } else {
      result += char;
    }
  }
  return result;
}

export function toUnicodeMonospace(text: string): string {
  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      result += String.fromCodePoint(code + MONO_CAPS_OFFSET);
    } else if (code >= 97 && code <= 122) {
      result += String.fromCodePoint(code + MONO_LOW_OFFSET);
    } else if (code >= 48 && code <= 57) {
      result += String.fromCodePoint(code + MONO_DIGIT_OFFSET);
    } else {
      result += char;
    }
  }
  return result;
}

export function toUnicodeStrikethrough(text: string): string {
  // Add combining long stroke overlay
  return text.split('').map(c => (c === ' ' || c === '\n' ? c : c + '\u0336')).join('');
}

export function toUnicodeUnderline(text: string): string {
  // Add combining low line
  return text.split('').map(c => (c === ' ' || c === '\n' ? c : c + '\u0332')).join('');
}

/**
 * Strips all Unicode styled characters, combining accents, and markdown tags
 * returning pure, plain ASCII text.
 */
export function clearFormatting(text: string): string {
  // 1. Remove combining characters (underline, strikethrough)
  let clean = text.replace(/[\u0332\u0336]/g, '');

  // 2. Remove common Markdown wrappers
  clean = clean.replace(/\*\*(.*?)\*\*/g, '$1');
  clean = clean.replace(/\*(.*?)\*/g, '$1');
  clean = clean.replace(/~~(.*?)~~/g, '$1');
  clean = clean.replace(/`([^`]+)`/g, '$1');

  // 3. Map mathematical alphanumeric symbols back to plain characters
  let output = '';
  for (const char of clean) {
    const cp = char.codePointAt(0) || 0;

    // Sans Bold
    if (cp >= 0x1D5D4 && cp <= 0x1D5ED) {
      output += String.fromCharCode(cp - BOLD_CAPS_OFFSET);
    } else if (cp >= 0x1D5EE && cp <= 0x1D607) {
      output += String.fromCharCode(cp - BOLD_LOW_OFFSET);
    } else if (cp >= 0x1D7EC && cp <= 0x1D7F5) {
      output += String.fromCharCode(cp - BOLD_DIGIT_OFFSET);
    }
    // Serif Bold (also common in copied text)
    else if (cp >= 0x1D400 && cp <= 0x1D419) {
      output += String.fromCharCode(cp - 0x1D400 + 65);
    } else if (cp >= 0x1D41A && cp <= 0x1D433) {
      output += String.fromCharCode(cp - 0x1D41A + 97);
    } else if (cp >= 0x1D7CE && cp <= 0x1D7D7) {
      output += String.fromCharCode(cp - 0x1D7CE + 48);
    }
    // Sans Italic
    else if (cp >= 0x1D608 && cp <= 0x1D621) {
      output += String.fromCharCode(cp - ITALIC_CAPS_OFFSET);
    } else if (cp >= 0x1D622 && cp <= 0x1D63B) {
      output += String.fromCharCode(cp - ITALIC_LOW_OFFSET);
    }
    // Serif Italic
    else if (cp >= 0x1D434 && cp <= 0x1D44D) {
      output += String.fromCharCode(cp - 0x1D434 + 65);
    } else if (cp >= 0x1D44E && cp <= 0x1D467) {
      output += String.fromCharCode(cp - 0x1D44E + 97);
    }
    // Monospace
    else if (cp >= 0x1D670 && cp <= 0x1D689) {
      output += String.fromCharCode(cp - MONO_CAPS_OFFSET);
    } else if (cp >= 0x1D68A && cp <= 0x1D6A3) {
      output += String.fromCharCode(cp - MONO_LOW_OFFSET);
    } else if (cp >= 0x1D7F6 && cp <= 0x1D800) {
      output += String.fromCharCode(cp - MONO_DIGIT_OFFSET);
    } else {
      output += char;
    }
  }

  return output;
}

export function toTitleCase(text: string): string {
  return text.replace(/\b\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function toBulletList(text: string): string {
  const lines = text.split('\n');
  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return line;
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return trimmed;
    }
    return `• ${trimmed}`;
  }).join('\n');
}

export function toNumberedList(text: string): string {
  const lines = text.split('\n');
  let count = 1;
  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return line;
    // Replace existing numbering if present
    const cleaned = trimmed.replace(/^\d+[\.\)]\s*/, '');
    return `${count++}. ${cleaned}`;
  }).join('\n');
}

export function toQuote(text: string): string {
  const lines = text.split('\n');
  return lines.map(line => {
    if (!line.trim()) return line;
    if (line.trim().startsWith('> ')) return line;
    return `> ${line.trim()}`;
  }).join('\n');
}

/**
 * Apply formatting to selected text inside a textarea and return the new text
 * along with the new selection start and end positions.
 */
export function applyFormatToTextarea(
  fullText: string,
  selectionStart: number,
  selectionEnd: number,
  action: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'mono' | 'bullets' | 'numbers' | 'quote' | 'uppercase' | 'titlecase' | 'clear',
  mode: FormatMode = 'unicode'
): { newText: string; newStart: number; newEnd: number } {
  const hasSelection = selectionStart !== selectionEnd;
  const selectedText = hasSelection 
    ? fullText.substring(selectionStart, selectionEnd)
    : '';

  let transformed = '';

  if (mode === 'markdown') {
    switch (action) {
      case 'bold':
        transformed = hasSelection ? `**${selectedText}**` : '**bold text**';
        break;
      case 'italic':
        transformed = hasSelection ? `*${selectedText}*` : '*italic text*';
        break;
      case 'strikethrough':
        transformed = hasSelection ? `~~${selectedText}~~` : '~~strikethrough~~';
        break;
      case 'mono':
        transformed = hasSelection ? `\`${selectedText}\`` : '`code`';
        break;
      case 'bullets':
        transformed = toBulletList(selectedText || 'First key point\nSecond key point\nThird key point');
        break;
      case 'numbers':
        transformed = toNumberedList(selectedText || 'First priority\nSecond priority\nThird priority');
        break;
      case 'quote':
        transformed = toQuote(selectedText || 'High-signal quote or key insight');
        break;
      case 'uppercase':
        transformed = (selectedText || fullText).toUpperCase();
        break;
      case 'titlecase':
        transformed = toTitleCase(selectedText || fullText);
        break;
      case 'clear':
        transformed = clearFormatting(selectedText || fullText);
        break;
      default:
        transformed = selectedText;
    }
  } else {
    // Unicode Mode (Ideal for LinkedIn, X, and Facebook)
    switch (action) {
      case 'bold':
        transformed = toUnicodeBold(selectedText || 'Bold Headline');
        break;
      case 'italic':
        transformed = toUnicodeItalic(selectedText || 'Italic emphasis');
        break;
      case 'underline':
        transformed = toUnicodeUnderline(selectedText || 'Underlined hook');
        break;
      case 'strikethrough':
        transformed = toUnicodeStrikethrough(selectedText || 'Outdated method');
        break;
      case 'mono':
        transformed = toUnicodeMonospace(selectedText || 'TechBenchmark.v2');
        break;
      case 'bullets':
        transformed = toBulletList(selectedText || 'First key point\nSecond key point\nThird key point');
        break;
      case 'numbers':
        transformed = toNumberedList(selectedText || 'First priority\nSecond priority\nThird priority');
        break;
      case 'quote':
        transformed = toQuote(selectedText || 'High-signal client quote or takeaway');
        break;
      case 'uppercase':
        transformed = (selectedText || fullText).toUpperCase();
        break;
      case 'titlecase':
        transformed = toTitleCase(selectedText || fullText);
        break;
      case 'clear':
        transformed = clearFormatting(selectedText || fullText);
        break;
      default:
        transformed = selectedText;
    }
  }

  if (action === 'clear' && !hasSelection) {
    return {
      newText: clearFormatting(fullText),
      newStart: selectionStart,
      newEnd: selectionStart
    };
  }

  const before = fullText.substring(0, selectionStart);
  const after = fullText.substring(selectionEnd);
  const newText = before + transformed + after;
  const newStart = selectionStart;
  const newEnd = selectionStart + transformed.length;

  return { newText, newStart, newEnd };
}

/**
 * Format markdown tags into HTML for post live previews.
 * Unicode characters (Bold/Italic/etc.) pass through natively.
 */
export function formatPostPreviewHtml(text: string): string {
  if (!text) return '';
  let safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-950">$1</strong>');
  // Italic *text*
  safe = safe.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>');
  // Strikethrough ~~text~~
  safe = safe.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-400">$1</del>');
  // Inline Code `text`
  safe = safe.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-[11px]">$1</code>');

  return safe;
}
