import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered, 
  Quote, Smile, Hash, Sparkles, RotateCcw, ChevronDown, Check, Type
} from 'lucide-react';
import { FormatMode, applyFormatToTextarea } from '../../utils/textFormatter';

interface FormatToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  text: string;
  onTextChange: (newText: string) => void;
  formatMode?: FormatMode;
  onFormatModeChange?: (mode: FormatMode) => void;
  disabled?: boolean;
}

const EMOJI_GROUPS = [
  {
    name: 'Tech & Work',
    emojis: ['🚀', '⚡', '💡', '🛠️', '💻', '📱', '⚙️', '🤖', '📈', '📊']
  },
  {
    name: 'Signal & Focus',
    emojis: ['🎯', '📌', '📍', '✅', '❌', '⚠️', '🔍', '💎', '🔑', '🏷️']
  },
  {
    name: 'Social & Clicks',
    emojis: ['👇', '👉', '🧵', '💬', '📣', '🔔', '🤝', '👏', '🔥', '💯']
  }
];

const STUDIO_HASHTAGS = [
  '#b2b', '#saas', '#automation', '#mvp', 
  '#softwaredevelopment', '#ai', '#engineering', '#startups'
];

const HOOK_TEMPLATES = [
  {
    label: '📊 Statistic Hook',
    template: '📊 In 2026, 73% of B2B founders struggle with [bottleneck]. Here is why:'
  },
  {
    label: '⚠️ Contrarian Teardown',
    template: '⚠️ Most software studios tell you [myth].\n\nOur client data proves the exact opposite:'
  },
  {
    label: '🛠️ 6-Week Case Study',
    template: '🛠️ How we took [client] from [legacy bottleneck] to a production [solution] in 6 weeks without technical debt:'
  },
  {
    label: '👇 3 Key Lessons',
    template: '👇 3 production engineering lessons we learned shipping [system]:\n\n1. \n2. \n3. '
  }
];

export const FormatToolbar: React.FC<FormatToolbarProps> = ({
  textareaRef,
  text,
  onTextChange,
  formatMode = 'unicode',
  onFormatModeChange,
  disabled = false
}) => {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [hashtagOpen, setHashtagOpen] = useState(false);
  const [hookOpen, setHookOpen] = useState(false);
  const [caseMenuOpen, setCaseMenuOpen] = useState(false);

  const emojiRef = useRef<HTMLDivElement>(null);
  const hashtagRef = useRef<HTMLDivElement>(null);
  const hookRef = useRef<HTMLDivElement>(null);
  const caseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (emojiRef.current && !emojiRef.current.contains(target)) setEmojiOpen(false);
      if (hashtagRef.current && !hashtagRef.current.contains(target)) setHashtagOpen(false);
      if (hookRef.current && !hookRef.current.contains(target)) setHookOpen(false);
      if (caseRef.current && !caseRef.current.contains(target)) setCaseMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = (action: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'mono' | 'bullets' | 'numbers' | 'quote' | 'uppercase' | 'titlecase' | 'clear') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    const { newText, newStart, newEnd } = applyFormatToTextarea(
      text,
      start,
      end,
      action,
      formatMode
    );

    onTextChange(newText);

    // Restore focus and selection
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newStart, newEnd);
    }, 10);
  };

  const handleInsertString = (insertText: string) => {
    const el = textareaRef.current;
    if (!el) {
      onTextChange(text ? `${text} ${insertText}` : insertText);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const updated = before + insertText + after;

    onTextChange(updated);

    setTimeout(() => {
      el.focus();
      const pos = start + insertText.length;
      el.setSelectionRange(pos, pos);
    }, 10);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0 text-xs select-none">
      {/* Primary Formatting Controls */}
      <div className="flex items-center gap-0.5 flex-wrap">
        {/* Bold */}
        <button
          type="button"
          onClick={() => handleApply('bold')}
          disabled={disabled}
          title={`Bold (${formatMode === 'unicode' ? 'Unicode 𝗕𝗼𝗹𝗱 for LinkedIn/X/FB' : 'Markdown **bold**'})`}
          className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded transition-colors disabled:opacity-40"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => handleApply('italic')}
          disabled={disabled}
          title={`Italic (${formatMode === 'unicode' ? 'Unicode 𝘐𝘵𝘢𝘭𝘪𝘤 for LinkedIn/X/FB' : 'Markdown *italic*'})`}
          className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded transition-colors disabled:opacity-40"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => handleApply('underline')}
          disabled={disabled}
          title="Underline (Unicode low line)"
          className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded transition-colors disabled:opacity-40"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => handleApply('strikethrough')}
          disabled={disabled}
          title="Strikethrough"
          className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded transition-colors disabled:opacity-40"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        {/* Monospace / Code */}
        <button
          type="button"
          onClick={() => handleApply('mono')}
          disabled={disabled}
          title={`Monospace / Code (${formatMode === 'unicode' ? 'Unicode 𝙼𝚘𝚗𝚘' : 'Markdown `code`'})`}
          className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded transition-colors disabled:opacity-40"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => handleApply('bullets')}
          disabled={disabled}
          title="Bullet list (•)"
          className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded transition-colors disabled:opacity-40"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => handleApply('numbers')}
          disabled={disabled}
          title="Numbered list (1. 2. 3.)"
          className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded transition-colors disabled:opacity-40"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        {/* Quote */}
        <button
          type="button"
          onClick={() => handleApply('quote')}
          disabled={disabled}
          title="Quote / Callout (>)"
          className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded transition-colors disabled:opacity-40"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Text Case Menu */}
        <div className="relative" ref={caseRef}>
          <button
            type="button"
            onClick={() => setCaseMenuOpen(!caseMenuOpen)}
            disabled={disabled}
            title="Text case transformation"
            className="px-2 py-1 text-[11px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded flex items-center gap-1 transition-colors disabled:opacity-40"
          >
            <Type className="w-3 h-3" />
            <span>Case</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>

          {caseMenuOpen && (
            <div className="absolute left-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg py-1 z-30 text-xs">
              <button
                type="button"
                onClick={() => {
                  handleApply('titlecase');
                  setCaseMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-800"
              >
                Title Case
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApply('uppercase');
                  setCaseMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-800"
              >
                UPPERCASE
              </button>
            </div>
          )}
        </div>

        {/* Emoji Dropdown */}
        <div className="relative" ref={emojiRef}>
          <button
            type="button"
            onClick={() => setEmojiOpen(!emojiOpen)}
            disabled={disabled}
            title="Insert business emoji"
            className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded transition-colors disabled:opacity-40"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>

          {emojiOpen && (
            <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl p-2.5 z-30 text-xs space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold">
                High-Signal Emojis
              </div>
              {EMOJI_GROUPS.map(group => (
                <div key={group.name} className="space-y-1">
                  <div className="text-[10px] text-gray-500 font-medium">{group.name}</div>
                  <div className="grid grid-cols-5 gap-1">
                    {group.emojis.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => {
                          handleInsertString(e);
                          setEmojiOpen(false);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-sm transition-transform active:scale-90"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hashtags Dropdown */}
        <div className="relative" ref={hashtagRef}>
          <button
            type="button"
            onClick={() => setHashtagOpen(!hashtagOpen)}
            disabled={disabled}
            title="Insert studio hashtags"
            className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded transition-colors disabled:opacity-40"
          >
            <Hash className="w-3.5 h-3.5" />
          </button>

          {hashtagOpen && (
            <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-30 text-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-1.5 px-1">
                Studio Hashtags
              </div>
              <div className="flex flex-wrap gap-1">
                {STUDIO_HASHTAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      handleInsertString(` ${tag}`);
                      setHashtagOpen(false);
                    }}
                    className="px-2 py-0.5 rounded bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 font-mono text-[11px] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hook Templates Dropdown */}
        <div className="relative" ref={hookRef}>
          <button
            type="button"
            onClick={() => setHookOpen(!hookOpen)}
            disabled={disabled}
            title="Insert proven social hook template"
            className="px-2 py-1 text-[11px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded flex items-center gap-1 transition-colors disabled:opacity-40"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Hooks</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>

          {hookOpen && (
            <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-30 text-xs space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold px-1 mb-1">
                Editorial Hook Formulas
              </div>
              {HOOK_TEMPLATES.map(hook => (
                <button
                  key={hook.label}
                  type="button"
                  onClick={() => {
                    handleInsertString(text ? `\n\n${hook.template}` : hook.template);
                    setHookOpen(false);
                  }}
                  className="w-full text-left p-2 rounded hover:bg-blue-50 text-gray-800 transition-colors border border-transparent hover:border-blue-100 group"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-blue-700 text-xs">
                    {hook.label}
                  </div>
                  <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                    {hook.template.split('\n')[0]}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => handleApply('clear')}
          disabled={disabled}
          title="Clear formatting (strip Unicode / Markdown styling)"
          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors disabled:opacity-40 ml-0.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Format Mode Switcher: Unicode (Social) vs Markdown (CMS) */}
      {onFormatModeChange && (
        <div className="flex items-center gap-1 text-[10px]">
          <span className="text-gray-400 font-mono">Mode:</span>
          <button
            type="button"
            onClick={() => onFormatModeChange('unicode')}
            className={`px-1.5 py-0.5 rounded font-mono font-medium transition-colors ${
              formatMode === 'unicode'
                ? 'bg-blue-100 text-blue-800 border border-blue-200 font-semibold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            title="Unicode bold/italic renders natively in LinkedIn, X, and Facebook feeds"
          >
            Unicode
          </button>
          <button
            type="button"
            onClick={() => onFormatModeChange('markdown')}
            className={`px-1.5 py-0.5 rounded font-mono font-medium transition-colors ${
              formatMode === 'markdown'
                ? 'bg-blue-100 text-blue-800 border border-blue-200 font-semibold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            title="Markdown (**bold**, *italic*) for Website/Blog CMS"
          >
            Markdown
          </button>
        </div>
      )}
    </div>
  );
};
