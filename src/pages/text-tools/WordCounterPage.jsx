import { useMemo, useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';

function WordCounterPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const normalized = text.replace(/\r\n/g, '\n');
    const words = normalized.trim() ? normalized.trim().split(/\s+/).filter(Boolean).length : 0;
    const charactersWithSpaces = normalized.length;
    const charactersWithoutSpaces = normalized.replace(/\s/g, '').length;
    const sentences = normalized.split(/[.!?]+/).filter((part) => part.trim().length > 0).length;
    const paragraphs = normalized.trim() ? normalized.trim().split(/\n\s*\n+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    return {
      words,
      charactersWithSpaces,
      charactersWithoutSpaces,
      sentences,
      paragraphs,
      readingTime,
    };
  }, [text]);

  return (
    <ToolPageTemplate
      title="Word Counter"
      description="Count words, characters, sentences, paragraphs, and estimate reading time as you type."
      metaDescription="Count words, characters, sentences, and paragraphs in writing, notes, or blog drafts."
      usageSteps={[
        'Paste or type your text into the editor.',
        'Read the live summary on the right as you work.',
        'Use the counts for submissions, blog posts, or any content that needs a quick length check.',
      ]}
      faqItems={[
        {
          question: 'Does it count hyphenated words as one or two?',
          answer: 'The counter treats whitespace-separated tokens as words, so hyphenated forms count as a single word in the current logic.',
        },
        {
          question: 'Is the reading-time estimate exact?',
          answer: 'It is a rough estimate based on a standard 200 words per minute reading pace, not a precise human-readability score.',
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Enter text</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={14}
            placeholder="Type or paste your text here..."
            className="min-h-[280px] w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-slate-500 focus:bg-white"
          />
        </label>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Summary</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['Words', stats.words],
                ['Characters', stats.charactersWithSpaces],
                ['Characters (no spaces)', stats.charactersWithoutSpaces],
                ['Sentences', stats.sentences],
                ['Paragraphs', stats.paragraphs],
                ['Reading time', `${stats.readingTime} min`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white bg-white p-3 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Tips</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Very large content is handled efficiently with memoized counts.</li>
              <li>Empty input shows zeroed values instead of breaking the UI.</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default WordCounterPage;
